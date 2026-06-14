<?php
// news_search.php - Cari berita berdasarkan judul
require_once("conn.php");

try {
    $keyword = isset($_GET["keyword"]) ? $_GET["keyword"] : "";
    
    $sql = "SELECT n.*, u.nama as author_name, u.username,
            AVG(r.rating) as avg_rating,
            COUNT(DISTINCT r.id) as total_ratings,
            COUNT(DISTINCT c.id) as total_comments
            FROM news n
            INNER JOIN users u ON n.user_id = u.id
            LEFT JOIN ratings r ON n.id = r.news_id
            LEFT JOIN comments c ON n.id = c.news_id
            WHERE n.judul LIKE ?
            GROUP BY n.id
            ORDER BY n.created_at DESC";
    
    $search_keyword = "%" . $keyword . "%";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $search_keyword);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result) {
        $news_list = [];
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
            
            $news_list[] = $row;
        }
        
        echo json_encode([
            "result" => "success", 
            "data" => $news_list,
            "total" => count($news_list)
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal mencari berita"]);
    }
    
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>