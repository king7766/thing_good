<?php
require __DIR__ . "/inc/bootstrap.php";
require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/RoomController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/UserRoomMappingController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/CardController.php";


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

/*
if ((isset($uri[2]) && $uri[2] != 'user') || !isset($uri[3])) {
    header("HTTP/1.1 404 Not Found");
    exit();
}
*/

//echo $uri[3].'<br>'. $uri[4];

if( isset($uri[3]) && $uri[3] == 'user') 
{

    $objFeedController = new UserController();
    $strMethodName = $uri[4] . 'Action';
    $objFeedController->{$strMethodName}();   
    
}

else if( isset($uri[3]) && $uri[3] == 'room') 
{
    $objFeedController = new RoomController();
    $strMethodName = $uri[4] . 'Action';
    $objFeedController->{$strMethodName}();    
}
else if( isset($uri[3]) && $uri[3] == 'mapping') 
{
    $objFeedController = new UserRoomMappingController();
    $strMethodName = $uri[4] . 'Action';
    $objFeedController->{$strMethodName}();    
}
else if( isset($uri[3]) && $uri[3] == 'card') 
{
    $objFeedController = new CardController();
    $strMethodName = $uri[4] . 'Action';
    $objFeedController->{$strMethodName}();    
}
else
{
    header("HTTP/1.1 404 Not Found");
    exit();
}


 
//require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";
 

?>