<?php
// comment_delete.php - Hapus komentar (hanya pembuat)
require_once("conn.php");

try {
    $comment_id = $_POST["comment_id"];
    $user_id = $_POST["user_id"];
    
    // Cek apakah user adalah pembuat komentar
    $stmt = $conn->prepare("SELECT user_id FROM comments WHERE id = ?");
    $stmt->bind_param("i", $comment_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $comment = $result->fetch_assoc();
        
        if ($comment["user_id"] != $user_id) {
            echo json_encode(["result" => "error", "message" => "Anda tidak memiliki akses untuk menghapus komentar ini"]);
            exit;
        }
        
        // Delete comment (cascade akan menghapus replies)
        $delete_stmt = $conn->prepare("DELETE FROM comments WHERE id = ?");
        $delete_stmt->bind_param("i", $comment_id);
        
        if ($delete_stmt->execute()) {
            echo json_encode([
                "result" => "success", 
                "message" => "Komentar berhasil dihapus"
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "Gagal menghapus komentar"]);
        }
    } else {
        echo json_encode(["result" => "error", "message" => "Komentar tidak ditemukan"]);
    }
    
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>