<?php
require_once 'base_api.php';

class DepartmentsAPI extends BaseAPI {
    public function __construct() {
        parent::__construct('departments', 'id', [
            'id' => 'ID',
            'name' => 'Name',
            'description' => 'Description'
        ], ['id']); // Hide ID column for departments
    }
}

$api = new DepartmentsAPI();
$api->handleRequest();
?>
