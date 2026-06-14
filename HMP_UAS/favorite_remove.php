<?php
// favorite_remove.php
require_once("conn.php");

try {
    $user_id = $_POST["user_id"];
    $news_id = $_POST["news_id"];
    
    $stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = ? AND news_id = ?");
    $stmt->bind_param("ii", $user_id, $news_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "result" => "success", 
                "message" => "Berhasil dihapus dari favorite"
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "Berita tidak ada di favorite"]);
        }
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal menghapus dari favorite"]);
    }
    
    $stmt->close();
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>