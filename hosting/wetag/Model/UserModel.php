<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
 
class UserModel extends Database
{
    public function getUserslist($limit)
    {
        
        //return $this->select("SELECT * FROM Users ORDER BY ID ASC LIMIT 2", null);
        
        return $this->select("SELECT * FROM Users ORDER BY ID ASC LIMIT ?", 'i', [$limit]);
        
        
        //echo "SELECT * FROM Users ORDER BY ID ASC LIMIT ?", ["i", $limit];
        
        //return $this->select("SELECT * FROM Users ORDER BY ID ");
        
        //return $this->select("SELECT * FROM users ORDER BY user_id ASC LIMIT ?", ["i", $limit]);
    }
    
    public function getUsers($udid)
    {
        return $this->select("SELECT * FROM Users WHERE UDID = ?", 's', [$udid]);
    }
    
    public function updateUsers($udid, $userName)
    {
        return $this->operationStatement("UPDATE Users SET UserName = ? WHERE UDID = ? ", 'ss', [$userName, $udid]);
    }

    public function updateUsersAvator($udid, $avator)
    {
        return $this->operationStatement("UPDATE Users SET Avator = ? WHERE UDID = ? ", 'ss', [$avator, $udid]);
    }
    
    public function insertUsers($udid, $userName)
    {
       
        //INSERT INTO Persons (`Name`) VALUES ('666')
        //return $this->select("INSERT INTO Persons ('Name') VALUES (?)", ["s", $name]);
         
         
        //$stmt = $mysqli->prepare("INSERT INTO People VALUES (?, ?, ?, ?)");
        
        //return $this->executeStatement("INSERT INTO User ('UDID', 'UserName') VALUES (?, ?)", [$id, $userName]);
        
        
        // work
        //return $this->select("SELECT * FROM Persons ORDER BY Personid ASC LIMIT ?", ["i", $limit]);
        //return $this->select("INSERT INTO Persons (Name) VALUES (?)", ["s", $name]);
        
        
        
        //return $this->select("INSERT INTO Users (UDID, UserName) VALUES (?, ?)", 'ss', [$udid, $userName]);
        
        //return $this->operationStatement("SELECT * FROM Users WHERE ? AND ? ", 'ii', [1, 1]);
        
        return $this->operationStatement("INSERT INTO Users (UDID, UserName) VALUES (?, ?) ", 'ss', [$udid, $userName]);

        //return $this->operationStatment("INSERT INTO Persons (Name ) VALUES (?)", 's', [ $userName]);



        //return $this->insertStatment();
        
        //return $this->select("SELECT * FROM users ORDER BY user_id ASC LIMIT ?", ["i", $limit]);
    }
    
}