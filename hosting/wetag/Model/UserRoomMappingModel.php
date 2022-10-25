<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
 
class UserRoomMappingModel extends Database
{
    public function getUserRoomMapping($room_id)
    {
    
        return $this->select("SELECT Users.Avator, Users.Username, UserRoomMapping.user_id, UserRoomMapping.room_id, UserRoomMapping.Position FROM `UserRoomMapping` INNER JOIN `Users` ON Users.ID = UserRoomMapping.user_id WHERE room_id = ? ORDER BY Position ASC", 'i', [$room_id]);

    }
    
    public function insertUserRoomMapping($room_id, $user_id)
    {
        return $this->operationStatement("INSERT INTO UserRoomMapping (room_id, user_id) VALUES (?, ?) ", 'ss', [$room_id, $user_id]);
    }

    public function removeUserRoomMapping($room_id, $user_id)
    {
        return $this->operationStatement("DELETE FROM UserRoomMapping WHERE room_id = ? AND user_id = ?", 'ss', [$room_id, $user_id]);
    }

    public function getCardsList($room_id, $user_id)
    {
    
        return $this->select("SELECT * FROM UserRoomMapping WHERE room_id = ? AND user_id = ? ", 'ss', [$room_id, $user_id]);
        
        //return $this->select("SELECT Users.Username, UserRoomMapping.user_id, UserRoomMapping.room_id, UserRoomMapping.Position FROM `UserRoomMapping` INNER JOIN `Users` ON Users.ID = UserRoomMapping.user_id WHERE room_id = ? ", 'i', [$room_id]);
       
    }
    

    public function startGameSetup($room_id)
    {
        
        $userArray = $this->select("SELECT Users.Username, UserRoomMapping.user_id, UserRoomMapping.room_id, UserRoomMapping.Position FROM `UserRoomMapping` INNER JOIN `Users` ON Users.ID = UserRoomMapping.user_id WHERE room_id = ? ", 'i', [$room_id]);

        shuffle($userArray);
        //print_r($userArray);

        $card_list = $this->select("SELECT ID, content FROM Cards WHERE ? ", 'i', [1]);
        shuffle($card_list);
        
        $position_array = [];
        for ($i = 0; $i < count($userArray); $i++)  {
            array_push($position_array,$i);
        }

        shuffle($position_array);

        $card_index = 0;

        $query = 'INSERT INTO UserRoomMapping (user_id, room_id, Position, Cards) VALUES ';
        
        for ($i = 0; $i < count($userArray); $i++)  {
            //$object =  $card_list[$card_index];
            
            /*
            $cards_string = '';
            $cards_string =  $cards_string.$card_list[$card_index]['ID'].',';
            $card_index++;
            $cards_string =  $cards_string.$card_list[$card_index]['ID'].',';
            $card_index++;
            $cards_string =  $cards_string.$card_list[$card_index]['ID'].',';
            $card_index++;
            $cards_string =  $cards_string.$card_list[$card_index]['ID'];
            $card_index++;
            */

            $cards_string = '';
            for($j = 0; $j < 10 ; $j++)
            {
                $cards_string =  $cards_string.$card_list[$card_index]['ID'].',';
                $card_index++;
            }
            $cards_string = substr($cards_string, 0, -1); 

            //$cards_string =  $cards_string.$object['ID'].',';
            
            
            //print_r($userArray[$i]['user_id']. ' : '.$object['content'] .'\n');


            //print_r($object['content']);
            //print_r('\n');

            //print($cards_string.'     ');
            
            
            //print_r($userArray[$i]['user_id'] .': '.$position_array[$i]. ' : '.$object['content'] .'\n' );
            //print_r($object->ID);


            $query .= ' ('.$userArray[$i]['user_id'].','.$room_id.','.$position_array[$i].','.'"'.$cards_string.'"),';
        }

        /*
        $query = 'INSERT INTO UserRoomMapping (user_id, room_id, Position, Cards) VALUES ';
        $query .= ' (1, 1, 3, 5)  ,';
        $query .= ' (2, 1, 4, 6)  ';
        $query .= ' AS new_UserRoomMapping';
        $query .= ' ON DUPLICATE KEY UPDATE';
        $query .= ' Position =  new_UserRoomMapping.Position,';
        $query .= ' Cards =  new_UserRoomMapping.Cards;';
        */

        $query = substr($query, 0, -1); 
        $query .= ' AS new_UserRoomMapping';
        $query .= ' ON DUPLICATE KEY UPDATE';
        $query .= ' Position =  new_UserRoomMapping.Position,';
        $query .= ' Cards =  new_UserRoomMapping.Cards;';
        

        //print_r($query);

        //return $this->select('SELECT * FROM Users WHERE 1','i', [1]);
        

        //return $this->exe('SELECT * FROM Users WHERE ?','i', [1]);
        //return $this->select("SELECT Users.Username, UserRoomMapping.user_id, UserRoomMapping.room_id, UserRoomMapping.Position FROM `UserRoomMapping` INNER JOIN `Users` ON Users.ID = UserRoomMapping.user_id WHERE room_id = ? ", 'i', [$room_id]);
       
        return $this->executeStatement($query);
        
      
    }
    
}