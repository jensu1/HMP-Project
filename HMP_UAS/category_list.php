<?php
// category_list.php - Menampilkan semua kategori dengan jumlah berita
require_once("conn.php");

try {
    $sql = "SELECT c.*, COUNT(DISTINCT nc.news_id) as total_berita 
            FROM categories c 
            LEFT JOIN news_categories nc ON c.id = nc.category_id 
            GROUP BY c.id 
            ORDER BY c.nama_kategori ASC";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
        echo json_encode([
            "result" => "success", 
            "data" => $categories
        ]);
    } else {
        echo json_encode(["result" => "error", "message" => "Gagal mengambil data kategori"]);
    }
    
    $conn->close();
} catch(Exception $e) {
    echo json_encode(["result" => "error", "message" => $e->getMessage()]);
}
?>