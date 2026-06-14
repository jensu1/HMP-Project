<?php
    header("content-type: application/json");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    // UBAYA
    // $servername = "localhost";
    // $username = "hybrid_160723033";
    // $password = "ubaya";
    // $dbname = "hmp_uas";

    // Localhost
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "hmp_uas";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
?>