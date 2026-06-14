<?php
// rating_create.php - Tambah/update rating (1-5)
require_once("conn.php");

try {
    $news_id = $_POST["news_id"];
    $user_id = $_POST["user_id"];
    $rating = $_POST["rating"];
    
    // Validasi rating 1-5
    if ($rating < 1 || $rating > 5) {
        echo json_encode(["result" => "error", "message" => "Rating harus antara 1-5"]);
        exit;
    }
    
    // Cek apakah user sudah pernah rating berita ini
    $check_stmt = $conn->prepare("SELECT id FROM ratings WHERE news_id = ? AND user_id = ?");
    $check_stmt->bind_param("ii", $news_id, $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        // Update rating
        $stmt = $conn->prepare("UPDATE ratings SET rating = ? WHERE news_id = ? AND user_id = ?");
        $stmt->bind_param("iii", $rating, $news_id, $user_id);
        $message = "Rating berhasil diupdate";
    } else {
        // Insert rating baru
        $stmt = $conn->prepare("INSERT INTO ratings (news_id, user_id, rating) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $news_id, $user_id, $rating);
        $message = "Rating berhasil ditambahkan";
    }
    
    if ($stmt->execute()) {
        // Get average rating
        $avg_stmt = $conn->prepare("SELECT AVG(rating) as avg_rating FROM ratings WHERE news_id = ?");
        $avg_stmt->bind_param("i", $news_id);
        $avg_stmt->execute();
        $avg_result = $avg_stmt->get_result();
        $avg_data = $avg_result->fetch_assoc();
        
        echo json_encode([
            "result" => "success", 
            "message" => $message,
            "avg_rating" => round($avg_data["avg_rating"], 2)
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal menyimpan rating"]);
    }
    
    $stmt->close();
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>