<?php
define("PROJECT_ROOT_PATH", __DIR__ . "/../");

echo 'Current PHP version: ' . phpversion();
echo '<br>';


$servername = "localhost";
$username = "mysql";
$password = "P@ssw0rd";
$database = "wetag";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);
//$this->connection = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo "Connected failed</br>";

    die("Connection failed: " . $conn->connect_error);
}
else
{
    
    echo "Connected successfully";
}


// Perform query
if ($result = $conn -> query("SELECT * FROM Users")) {
    echo "<br> Returned rows are: " . $result -> num_rows;
    // Free result set
    $result -> free_result();
}

$conn->close();

?>