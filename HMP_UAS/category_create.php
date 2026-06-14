<?php
    require_once("conn.php");

    try {
        $nama_kategori = $_POST["nama_kategori"];
        $deskripsi = isset($_POST["deskripsi"]) ? $_POST["deskripsi"] : "";
        
        $stmt = $conn->prepare("INSERT INTO categories (nama_kategori, deskripsi) VALUES (?, ?)");
        $stmt->bind_param("ss", $nama_kategori, $deskripsi);
        
        if ($stmt->execute()) {
            echo json_encode([
                "result" => "success", 
                "message" => "Kategori berhasil ditambahkan",
                "category_id" => $conn->insert_id
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "Gagal menambahkan kategori"]);
        }
        
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        echo json_encode(["result" => "error", "message" => $e->getMessage()]);
    }
?>