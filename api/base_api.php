<?php
// Set proper headers for API responses
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

class BaseAPI {
    protected $db;
    protected $table;
    protected $primaryKey;
    protected $columns;
    protected $hiddenColumns;
    
    public function __construct($table, $primaryKey = 'id', $columns = [], $hiddenColumns = []) {
        $this->db = new Database();
        $this->table = $table;
        $this->primaryKey = $primaryKey;
        $this->columns = $columns;
        $this->hiddenColumns = $hiddenColumns;
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch ($method) {
            case 'GET':
                if (isset($_GET['action'])) {
                    switch ($_GET['action']) {
                        case 'list':
                            $this->list();
                            break;
                        case 'get':
                            $this->get($_GET['id']);
                            break;
                        case 'foreign_key_options':
                            $this->getForeignKeyOptions($_GET['table'], $_GET['value_field'], $_GET['text_field']);
                            break;
                        default:
                            $this->error('Invalid action', 400);
                    }
                } else {
                    $this->list();
                }
                break;
            case 'POST':
                $this->create();
                break;
            case 'PUT':
                $this->update();
                break;
            case 'DELETE':
                $this->delete();
                break;
            default:
                $this->error('Method not allowed', 405);
        }
    }
    
    public function list() {
        try {
            $sql = "SELECT * FROM {$this->table}";
            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll();
            
            $this->success($result);
        } catch (Exception $e) {
            $this->error('Failed to retrieve data: ' . $e->getMessage());
        }
    }
    
    public function get($id) {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?";
            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute([$id]);
            $result = $stmt->fetch();
            
            if ($result) {
                $this->success($result);
            } else {
                $this->error('Record not found', 404);
            }
        } catch (Exception $e) {
            $this->error('Failed to retrieve record: ' . $e->getMessage());
        }
    }
    
    public function create() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                $this->error('Invalid JSON data', 400);
                return;
            }
            
            $fields = array_keys($data);
            $placeholders = array_fill(0, count($fields), '?');
            
            $sql = "INSERT INTO {$this->table} (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute(array_values($data));
            
            $this->success(['id' => $this->db->getConnection()->lastInsertId(), 'message' => 'Record created successfully']);
        } catch (Exception $e) {
            $this->error('Failed to create record: ' . $e->getMessage());
        }
    }
    
    public function update() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || !isset($data[$this->primaryKey])) {
                $this->error('Invalid data or missing primary key', 400);
                return;
            }
            
            $id = $data[$this->primaryKey];
            unset($data[$this->primaryKey]);
            
            $fields = array_keys($data);
            $setClause = implode(' = ?, ', $fields) . ' = ?';
            
            $sql = "UPDATE {$this->table} SET {$setClause} WHERE {$this->primaryKey} = ?";
            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute(array_merge(array_values($data), [$id]));
            
            $this->success(['message' => 'Record updated successfully']);
        } catch (Exception $e) {
            $this->error('Failed to update record: ' . $e->getMessage());
        }
    }
    
    public function delete() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || !isset($data[$this->primaryKey])) {
                $this->error('Invalid data or missing primary key', 400);
                return;
            }
            
            $id = $data[$this->primaryKey];
            
            $sql = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?";
            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute([$id]);
            
            $this->success(['message' => 'Record deleted successfully']);
        } catch (Exception $e) {
            $this->error('Failed to delete record: ' . $e->getMessage());
        }
    }
    
    public function getForeignKeyOptions($table, $valueField, $textField) {
        try {
            $sql = "SELECT {$valueField} as value, {$textField} as text FROM {$table} ORDER BY {$textField}";
            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll();
            
            $this->success($result);
        } catch (Exception $e) {
            $this->error('Failed to retrieve foreign key options: ' . $e->getMessage());
        }
    }
    
    protected function success($data) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'data' => $data]);
        exit;
    }
    
    protected function error($message, $code = 500) {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode(['success' => false, 'error' => $message]);
        exit;
    }
}
?>
