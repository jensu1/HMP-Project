<?php   
    // user_profile.php - Menampilkan detail profile user
    require_once("conn.php");

    try {
        $user_id = $_GET["user_id"];
        
        $stmt = $conn->prepare("SELECT id, nama, email, username, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode([
                "result" => "success",
                "data" => $user
            ]);
        } else {
            echo json_encode(["result" => "error", "message" => "User tidak ditemukan"]);
        }
        
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        echo json_encode(["result" => "error", "message" => $e->getMessage()]);
    }
?>
