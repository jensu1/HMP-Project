<?php
// comment_create.php - Tambah komentar/reply
require_once("conn.php");

try {
    $news_id = $_POST["news_id"];
    $user_id = $_POST["user_id"];
    $comment_text = $_POST["comment_text"];
    $parent_comment_id = isset($_POST["parent_comment_id"]) ? $_POST["parent_comment_id"] : null;
    
    $stmt = $conn->prepare("INSERT INTO comments (news_id, user_id, parent_comment_id, comment_text) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $news_id, $user_id, $parent_comment_id, $comment_text);
    
    if ($stmt->execute()) {
        echo json_encode([
            "result" => "success", 
            "message" => "Komentar berhasil ditambahkan",
            "comment_id" => $conn->insert_id
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal menambahkan komentar"]);
    }
    
    $stmt->close();
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>