<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
 
class RoomModel extends Database
{
    public function getRoomList()
    {
        return $this->select("SELECT * FROM Rooms WHERE ? AND room_status = 'W'", "i", [1]);
    }
    
    public function getRoom($room_id)
    {
        
        return $this->select("SELECT * FROM Rooms WHERE ID = ?", "i", [$room_id]);
        //return $this->select("SELECT * FROM users ORDER BY user_id ASC LIMIT ?", ["i", $limit]);
    }
    
    public function insertRoom($creator_id,$room_name )
    {
        return $this->operationStatement("INSERT INTO Rooms (creator_id, room_name) VALUES (?, ?) ", 'ss', [$creator_id, $room_name]);
    }
    
    public function updateRoomName( $room_name, $room_id )
    {
        return $this->operationStatement("UPDATE Rooms SET room_name = ? WHERE ID = ? ", 'ss', [$room_name, $room_id]);
        
       
    }

    public function updateRoomStatus($status, $room_id)
    {
        return $this->operationStatement("UPDATE Rooms SET room_status = ? WHERE ID = ? ", 'ss', [$status, $room_id]);
        
    }
    
    
    

    
   
}