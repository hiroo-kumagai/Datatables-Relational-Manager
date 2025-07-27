<?php
require_once 'base_api.php';

class EmployeesAPI extends BaseAPI {
    public function __construct() {
        parent::__construct('employees', 'id', [
            'id' => 'ID',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'position' => 'Position',
            'department_id' => 'Department',
            'security_card_id' => 'Security Card',
            'hire_date' => 'Hire Date',
            'salary' => 'Salary',
            'status' => 'Status'
        ]);
    }
    
    public function list() {
        try {
            $sql = "SELECT 
                        e.id,
                        e.first_name,
                        e.last_name,
                        e.email,
                        e.phone,
                        e.position,
                        e.department_id,
                        d.name as department_name,
                        e.security_card_id,
                        sc.card_number,
                        e.hire_date,
                        e.salary,
                        e.status
                    FROM employees e
                    LEFT JOIN departments d ON e.department_id = d.id
                    LEFT JOIN security_cards sc ON e.security_card_id = sc.id
                    ORDER BY e.last_name, e.first_name";
            
            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll();
            
            $this->success($result);
        } catch (Exception $e) {
            $this->error('Failed to retrieve employees: ' . $e->getMessage());
        }
    }
}

$api = new EmployeesAPI();
$api->handleRequest();
?>
