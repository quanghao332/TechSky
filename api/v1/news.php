<?php
require_once '../config/database.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $conn->prepare("SELECT * FROM news WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            // Lấy danh sách, bài mới nhất lên đầu
            $stmt = $conn->query("SELECT * FROM news ORDER BY created_at DESC");
            echo json_encode(["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        }
        break;

    case 'POST':
        try {
            $sql = "INSERT INTO news (title, content, image, created_at) VALUES (?, ?, ?, NOW())";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$input['title'], $input['content'], $input['image']]);
            echo json_encode(["status" => "success", "message" => "Đã xuất bản bài viết mới!"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        try {
            // Cập nhật created_at=NOW() để bài viết nhảy lên đầu danh sách sau khi sửa
            $sql = "UPDATE news SET title=?, content=?, image=?, created_at=NOW() WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$input['title'], $input['content'], $input['image'], $id]);
            echo json_encode(["status" => "success", "message" => "Cập nhật bài viết thành công!"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Đã xóa bài viết!"]);
        break;
}