<?php
// news_delete.php - Hapus berita (hanya pembuat)
require_once("conn.php");

try {
    $news_id = $_POST["news_id"];
    $user_id = $_POST["user_id"];
    
    // Cek apakah user adalah pembuat berita
    $stmt = $conn->prepare("SELECT user_id FROM news WHERE id = ?");
    $stmt->bind_param("i", $news_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $news = $result->fetch_assoc();
        
        if ($news["user_id"] != $user_id) {
            echo json_encode(["result" => "error", "message" => "Anda tidak memiliki akses untuk menghapus berita ini"]);
            exit;
        }
        
        // Delete news (cascade akan menghapus data terkait)
        $delete_stmt = $conn->prepare("DELETE FROM news WHERE id = ?");
        $delete_stmt->bind_param("i", $news_id);
        
        if ($delete_stmt->execute()) {
            echo json_encode([
                "result" => "success", 
                "message" => "Berita berhasil dihapus"
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "Gagal menghapus berita"]);
        }
    } else {
        echo json_encode(["result" => "error", "message" => "Berita tidak ditemukan"]);
    }
    
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>