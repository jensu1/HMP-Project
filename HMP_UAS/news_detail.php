<?php
// news_detail.php
require_once("conn.php");

try {
    $news_id = $_GET["news_id"];
    $user_id = isset($_GET["user_id"]) ? $_GET["user_id"] : null;
    
    // Update view count
    $update_sql = "UPDATE news SET view_count = view_count + 1 WHERE id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("i", $news_id);
    $update_stmt->execute();
    
    // Get news detail
    $sql = "SELECT n.id, n.user_id, n.judul, n.deskripsi, n.foto_utama, n.view_count, 
            n.created_at, n.updated_at,
            u.nama as author_name, u.username,
            AVG(r.rating) as avg_rating,
            COUNT(DISTINCT r.id) as total_ratings,
            COUNT(DISTINCT c.id) as total_comments
            FROM news n
            INNER JOIN users u ON n.user_id = u.id
            LEFT JOIN ratings r ON n.id = r.news_id
            LEFT JOIN comments c ON n.id = c.news_id
            WHERE n.id = ?
            GROUP BY n.id, n.user_id, n.judul, n.deskripsi, n.foto_utama, n.view_count, 
                     n.created_at, n.updated_at, u.nama, u.username";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $news_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $news = $result->fetch_assoc();
        
        // Get categories
        $cat_sql = "SELECT c.* FROM categories c 
                   INNER JOIN news_categories nc ON c.id = nc.category_id 
                   WHERE nc.news_id = ?";
        $cat_stmt = $conn->prepare($cat_sql);
        $cat_stmt->bind_param("i", $news_id);
        $cat_stmt->execute();
        $cat_result = $cat_stmt->get_result();
        
        $categories = [];
        while ($cat = $cat_result->fetch_assoc()) {
            $categories[] = $cat;
        }
        $news["categories"] = $categories;
        
        // Get images
        $img_sql = "SELECT * FROM news_images WHERE news_id = ? ORDER BY urutan ASC";
        $img_stmt = $conn->prepare($img_sql);
        $img_stmt->bind_param("i", $news_id);
        $img_stmt->execute();
        $img_result = $img_stmt->get_result();
        
        $images = [];
        while ($img = $img_result->fetch_assoc()) {
            $images[] = $img;
        }
        $news["images"] = $images;
        
        // Check if favorited by user
        $is_favorited = false;
        if ($user_id) {
            $fav_sql = "SELECT id FROM favorites WHERE user_id = ? AND news_id = ?";
            $fav_stmt = $conn->prepare($fav_sql);
            $fav_stmt->bind_param("ii", $user_id, $news_id);
            $fav_stmt->execute();
            $fav_result = $fav_stmt->get_result();
            $is_favorited = $fav_result->num_rows > 0;
        }
        $news["is_favorited"] = $is_favorited;
        
        // Get user rating if logged in
        $user_rating = 0;
        if ($user_id) {
            $rating_sql = "SELECT rating FROM ratings WHERE user_id = ? AND news_id = ?";
            $rating_stmt = $conn->prepare($rating_sql);
            $rating_stmt->bind_param("ii", $user_id, $news_id);
            $rating_stmt->execute();
            $rating_result = $rating_stmt->get_result();
            if ($rating_result->num_rows > 0) {
                $rating_data = $rating_result->fetch_assoc();
                $user_rating = $rating_data["rating"];
            }
        }
        $news["user_rating"] = $user_rating;
        
        echo json_encode([
            "result" => "success", 
            "data" => $news
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Berita tidak ditemukan"]);
    }
    
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>