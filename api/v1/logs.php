<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100");
    $stmt->execute();
    $logs = $stmt->fetchAll();
    
    echo json_encode(["status" => "success", "data" => $logs]);
}
?>