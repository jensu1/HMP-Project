<?php
// favorite_add.php
require_once("conn.php");

try {
    $user_id = $_POST["user_id"];
    $news_id = $_POST["news_id"];
    
    // Cek apakah sudah ada di favorite
    $check_stmt = $conn->prepare("SELECT id FROM favorites WHERE user_id = ? AND news_id = ?");
    $check_stmt->bind_param("ii", $user_id, $news_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        echo json_encode(["result" => "error", "message" => "Berita sudah ada di favorite"]);
        exit;
    }
    
    $stmt = $conn->prepare("INSERT INTO favorites (user_id, news_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $news_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            "result" => "success", 
            "message" => "Berhasil ditambahkan ke favorite"
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal menambahkan ke favorite"]);
    }
    
    $stmt->close();
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>