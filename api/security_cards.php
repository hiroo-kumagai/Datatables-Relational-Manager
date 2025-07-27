<?php
require_once 'base_api.php';

class SecurityCardsAPI extends BaseAPI {
    public function __construct() {
        parent::__construct('security_cards', 'id', [
            'id' => 'ID',
            'card_number' => 'Card Number',
            'card_type' => 'Card Type',
            'access_level' => 'Access Level',
            'issue_date' => 'Issue Date',
            'expiry_date' => 'Expiry Date',
            'status' => 'Status'
        ]);
    }
}

$api = new SecurityCardsAPI();
$api->handleRequest();
?>
