<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Kiểm tra nếu chưa đăng nhập thì đá về trang login.php
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // Lưu ý: Nếu cậu chưa có file login.php, hãy comment dòng dưới đây lại
    // header("Location: login.php");
    // exit;
}
?>