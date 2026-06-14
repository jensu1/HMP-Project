<?php
// favorite_list.php
require_once("conn.php");

try {
    $user_id = $_GET["user_id"];
    
    $sql = "SELECT n.id, n.user_id, n.judul, n.deskripsi, n.foto_utama, n.view_count, 
            n.created_at, n.updated_at,
            u.nama as author_name, u.username,
            AVG(r.rating) as avg_rating,
            COUNT(DISTINCT r.id) as total_ratings,
            COUNT(DISTINCT c.id) as total_comments,
            f.created_at as favorited_at
            FROM favorites f
            INNER JOIN news n ON f.news_id = n.id
            INNER JOIN users u ON n.user_id = u.id
            LEFT JOIN ratings r ON n.id = r.news_id
            LEFT JOIN comments c ON n.id = c.news_id
            WHERE f.user_id = ?
            GROUP BY n.id, n.user_id, n.judul, n.deskripsi, n.foto_utama, n.view_count, 
                     n.created_at, n.updated_at, u.nama, u.username, f.created_at
            ORDER BY f.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result) {
        $favorites = [];
        while ($row = $result->fetch_assoc()) {
            // Get categories for this news
            $cat_sql = "SELECT c.* FROM categories c 
                       INNER JOIN news_categories nc ON c.id = nc.category_id 
                       WHERE nc.news_id = ?";
            $cat_stmt = $conn->prepare($cat_sql);
            $cat_stmt->bind_param("i", $row["id"]);
            $cat_stmt->execute();
            $cat_result = $cat_stmt->get_result();
            
            $categories = [];
            while ($cat = $cat_result->fetch_assoc()) {
                $categories[] = $cat;
            }
            $row["categories"] = $categories;
            
            $favorites[] = $row;
        }
        
        echo json_encode([
            "result" => "success", 
            "data" => $favorites,
            "total" => count($favorites)
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal mengambil data favorite"]);
    }
    
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>