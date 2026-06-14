<?php   
    // news_create.php - Membuat berita baru dengan foto URL & multiple thumbnail URLs
    require_once("conn.php");

    try {
        $user_id = $_POST["user_id"];
        $judul = $_POST["judul"];
        $deskripsi = $_POST["deskripsi"];
        $categories = json_decode($_POST["categories"], true); // Array of category IDs
        $foto_utama = isset($_POST["foto_utama"]) ? $_POST["foto_utama"] : null;
        $images = isset($_POST["images"]) ? json_decode($_POST["images"], true) : [];
        
        // Cek apakah judul sudah ada
        $stmt = $conn->prepare("SELECT id FROM news WHERE judul = ?");
        $stmt->bind_param("s", $judul);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(["result" => "error", "message" => "Judul berita sudah ada"]);
            exit;
        }
        
        // Insert berita dengan foto_utama sebagai URL
        $stmt = $conn->prepare("INSERT INTO news (user_id, judul, deskripsi, foto_utama) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $user_id, $judul, $deskripsi, $foto_utama);
        
        if ($stmt->execute()) {
            $news_id = $conn->insert_id;
            
            // Insert categories
            if (!empty($categories)) {
                $stmt_cat = $conn->prepare("INSERT INTO news_categories (news_id, category_id) VALUES (?, ?)");
                foreach ($categories as $category_id) {
                    $stmt_cat->bind_param("ii", $news_id, $category_id);
                    $stmt_cat->execute();
                }
                $stmt_cat->close();
            }
            
            // Insert thumbnail images sebagai URL
            if (!empty($images)) {
                $stmt_img = $conn->prepare("INSERT INTO news_images (news_id, image_path, urutan) VALUES (?, ?, ?)");
                for ($i = 0; $i < count($images); $i++) {
                    if (!empty($images[$i])) {
                        $image_url = $images[$i];
                        $urutan = $i + 1;
                        $stmt_img->bind_param("isi", $news_id, $image_url, $urutan);
                        $stmt_img->execute();
                    }
                }
                $stmt_img->close();
            }
            
            echo json_encode([
                "result" => "success", 
                "message" => "Berita berhasil ditambahkan",
                "news_id" => $news_id
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "Gagal menambahkan berita"]);
        }
        
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        echo json_encode(["result" => "error", "message" => $e->getMessage()]);
    }
?>