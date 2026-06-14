<?php
// comment_list.php - Tampilkan komentar dengan replies (nested)
require_once("conn.php");

try {
    $news_id = $_GET["news_id"];
    
    // Get all parent comments (tidak punya parent)
    $sql = "SELECT c.*, u.nama, u.username
            FROM comments c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.news_id = ? AND c.parent_comment_id IS NULL
            ORDER BY c.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $news_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result) {
        $comments = [];
        while ($row = $result->fetch_assoc()) {
            // Get replies untuk setiap comment
            $reply_sql = "SELECT c.*, u.nama, u.username
                         FROM comments c
                         INNER JOIN users u ON c.user_id = u.id
                         WHERE c.parent_comment_id = ?
                         ORDER BY c.created_at ASC";
            
            $reply_stmt = $conn->prepare($reply_sql);
            $reply_stmt->bind_param("i", $row["id"]);
            $reply_stmt->execute();
            $reply_result = $reply_stmt->get_result();
            
            $replies = [];
            while ($reply = $reply_result->fetch_assoc()) {
                $replies[] = $reply;
            }
            
            $row["replies"] = $replies;
            $row["total_replies"] = count($replies);
            $comments[] = $row;
        }
        
        echo json_encode([
            "result" => "success", 
            "data" => $comments,
            "total" => count($comments)
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal mengambil komentar"]);
    }
    
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>