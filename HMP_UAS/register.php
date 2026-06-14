<?php
    require_once("conn.php");

    try {
        $nama = $_POST["nama"];
        $email = $_POST["email"];
        $username = $_POST["username"];
        $password = $_POST["password"];
            
        // Cek email sudah terdaftar atau belum
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(["result" => "error", "message" => "Email sudah terdaftar"]);
            exit;
        }
        
        // Cek username sudah terdaftar atau belum
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(["result" => "error", "message" => "Username sudah terdaftar"]);
            exit;
        }
        
        // Insert user baru
        $stmt = $conn->prepare("INSERT INTO users (nama, email, username, password) VALUES (?, ?, ?, SHA2(?, 256))");
        $stmt->bind_param("ssss", $nama, $email, $username, $password);
        
        if ($stmt->execute()) {
            echo json_encode([
                "result" => "success", 
                "message" => "Registrasi berhasil",
                "user_id" => $conn->insert_id
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "Registrasi gagal"]);
        }
        
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        echo json_encode(["result" => "error", "message" => $e->getMessage()]);
    }
?>