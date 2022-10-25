
<?php

$servername = "localhost";
$username = "id19481065_admin";
$password = "weTagDBadmin123!";
$database = "id19481065_wetagdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

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
  echo "Returned rows are: " . $result -> num_rows;
  // Free result set
  $result -> free_result();
}

$conn->close();


?>