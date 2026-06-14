<?php
    require_once("conn.php");

    try{
        $username = $_POST["username"];
        $password = $_POST["password"];

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = SHA2(?, 256)");
        $stmt->bind_param("ss", $username, $password);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();        
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();                    
                $arr = ["result" => "success", "nama" => $user["nama"], "user_id" => $user["id"], "email" => $user["email"]];            
            } else {
                $arr = ["result" => "error", "message" => "Invalid username atau password"];
            }
        } else {
            $arr = ["result" => "error", "message" => "Query execution failed"];
        }
        
        echo json_encode($arr);
        $stmt->close();
        $conn->close();
    }
    catch(Exception $e){
        $arr = ["result" => "error", "message" => $e->getMessage()];
        echo json_encode($arr);
    }
?>