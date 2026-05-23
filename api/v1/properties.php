<?php
/**
 * File: api/v1/properties.php
 * Chịu trách nhiệm xử lý CRUD và Tìm kiếm Bất động sản
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// Xử lý Preflight request cho CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($method) {
        case 'GET':
            // 1. TRƯỜNG HỢP LẤY CHI TIẾT THEO ID
            if (isset($_GET['id'])) {
                $stmt = $conn->prepare("SELECT * FROM properties WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($data) {
                    echo json_encode(["status" => "success", "data" => $data]);
                } else {
                    http_response_code(404);
                    echo json_encode(["status" => "error", "message" => "Không tìm thấy bất động sản"]);
                }
            } 
            // 2. TRƯỜNG HỢP LẤY DANH SÁCH HOẶC TÌM KIẾM
            else {
                $conditions = [];
                $params = [];

                // Lọc theo Loại (Bán / Thuê)
                if (!empty($_GET['type']) && $_GET['type'] !== 'Tất cả') {
                    $conditions[] = "type = ?";
                    $params[] = $_GET['type'];
                }

                // Lọc theo Khoảng giá (Xử lý cột VARCHAR)
                // Kỹ thuật Senior: (price + 0) giúp lấy phần số ở đầu chuỗi "2.2 tỷ" -> 2.2
                if (!empty($_GET['price_range'])) {
                    $range = explode('-', $_GET['price_range']);
                    if (count($range) == 2) {
                        $conditions[] = "(price + 0) BETWEEN ? AND ?";
                        $params[] = (float)$range[0];
                        $params[] = (float)$range[1];
                    }
                }

                // Xây dựng câu SQL động
                $sql = "SELECT * FROM properties";
                if (!empty($conditions)) {
                    $sql .= " WHERE " . implode(" AND ", $conditions);
                }
                $sql .= " ORDER BY id DESC";

                $stmt = $conn->prepare($sql);
                $stmt->execute($params);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    "status" => "success",
                    "data" => $result
                ]);
            }
            break;

        case 'POST':
            $sql = "INSERT INTO properties (title, price, area, bed, wc, location, type, image, description, legal, user_post, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $input['title'] ?? '', 
                $input['price'] ?? '', 
                $input['area'] ?? 0, 
                $input['bed'] ?? 0, 
                $input['wc'] ?? 0, 
                $input['location'] ?? '', 
                $input['type'] ?? 'Bán', 
                $input['image'] ?? '', 
                $input['description'] ?? '', 
                $input['legal'] ?? '', 
                $input['user_post'] ?? 'Admin'
            ]);
            echo json_encode(["status" => "success", "message" => "Thêm BĐS mới thành công!"]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) throw new Exception("Thiếu ID cần cập nhật");
            
            $id = $_GET['id'];
            $sql = "UPDATE properties SET title=?, price=?, area=?, bed=?, wc=?, location=?, type=?, image=?, description=?, legal=?, user_post=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $input['title'], $input['price'], $input['area'], $input['bed'], 
                $input['wc'], $input['location'], $input['type'], $input['image'], 
                $input['description'], $input['legal'], $input['user_post'] ?? 'Admin', 
                $id
            ]);
            echo json_encode(["status" => "success", "message" => "Cập nhật dữ liệu thành công!"]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) throw new Exception("Thiếu ID cần xóa");
            
            $id = $_GET['id'];
            $stmt = $conn->prepare("DELETE FROM properties WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Đã xóa bất động sản thành công!"]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Lỗi Server: " . $e->getMessage()
    ]);
}
?>