<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'vendor/autoload.php';

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

// CẤU HÌNH CLOUDINARY (Giữ nguyên thông tin của bạn)
Configuration::instance([
    'cloud' => [
        'cloud_name' => 'dxly4wqmk', 
        'api_key'    => '435494188844567', 
        'api_secret' => 'vtFvApBro3zVp2HJNmQpWa4bfbA'
    ],
    'url' => ['secure' => true]
]);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

if (!isset($_FILES['images'])) {
    echo json_encode(["success" => false, "message" => "Không tìm thấy file gửi lên"]);
    exit;
}

try {
    $uploadApi = new UploadApi();
    $uploadedUrls = [];
    $files = $_FILES['images'];

    // Chuẩn hóa input để xử lý cả đơn file và đa file
    $fileTmps = is_array($files['tmp_name']) ? $files['tmp_name'] : [$files['tmp_name']];

    foreach ($fileTmps as $tmpName) {
        if (empty($tmpName)) continue;

        // Upload lên Cloudinary
        $result = $uploadApi->upload($tmpName, [
            'folder' => 'news_uploads',
            'transformation' => [
                ['quality' => 'auto', 'fetch_format' => 'auto']
            ]
        ]);
        $uploadedUrls[] = $result['secure_url'];
    }

    echo json_encode([
        "success" => true,
        "urls" => $uploadedUrls,
        "message" => "Tải lên thành công"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}