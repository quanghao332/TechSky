<?php
// Thiết lập Header để Frontend JS có thể gọi được API (Giải quyết triệt để lỗi CORS/403)
header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Nếu là request OPTIONS (Preflight của trình duyệt), trả về 200 luôn
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Thông tin kết nối cPanel Database
$host = "localhost"; // Thường cPanel để là localhost
$db_name = "rpyuoqjt_techsky_db"; 
$username = "rpyuoqjt_admin";
$password = "Anhhuy@213";

try {
    // Kết nối bằng PDO
    $conn = new PDO("mysql:host={$host};dbname={$db_name};charset=utf8mb4", $username, $password);
    
    // Set chế độ báo lỗi là Exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Trả về dữ liệu dạng mảng kết hợp (Associative Array)
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi kết nối Database: " . $exception->getMessage()
    ]);
    exit;
}
?>