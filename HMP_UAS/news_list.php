<?php
    // news_list.php - Menampilkan daftar berita (semua/per kategori) dengan rating & jumlah komentar
    require_once("conn.php");

    try {
        $category_id = isset($_GET["category_id"]) ? $_GET["category_id"] : null;
        
        if ($category_id) {
            // Get news by category
            $sql = "SELECT n.id, n.user_id, n.judul, n.deskripsi, n.foto_utama, n.view_count, 
                    n.created_at, n.updated_at,
                    u.nama as author_name, u.username,
                    AVG(r.rating) as avg_rating,
                    COUNT(DISTINCT r.id) as total_ratings,
                    COUNT(DISTINCT c.id) as total_comments
                    FROM news n
                    INNER JOIN users u ON n.user_id = u.id
                    INNER JOIN news_categories nc ON n.id = nc.news_id
                    LEFT JOIN ratings r ON n.id = r.news_id
                    LEFT JOIN comments c ON n.id = c.news_id
                    WHERE nc.category_id = ?
                    GROUP BY n.id, n.user_id, n.judul, n.deskripsi, n.foto_utama, n.view_count, 
                             n.created_at, n.updated_at, u.nama, u.username
                    ORDER BY n.created_at DESC";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $category_id);
            $stmt->execute();
            $result = $stmt->get_result();
        } else {
            // Get all news
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
                    GROUP BY n.id, n.user_id, n.judul, n.deskripsi, n.foto_utama, n.view_count, 
                             n.created_at, n.updated_at, u.nama, u.username
                    ORDER BY n.created_at DESC";
            
            $result = $conn->query($sql);
        }
        
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
                "data" => $news_list
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "Gagal mengambil data berita"]);
        }
        
        $conn->close();
    } catch(Exception $e) {
        echo json_encode(["result" => "error", "message" => $e->getMessage()]);
    }
?>