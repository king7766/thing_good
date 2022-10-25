<?php

class Database
{
    
    protected $connection = null;
 
    public function __construct()
    {
        try {
            
            
            $servername = "localhost";
            $username = "mysql";
            $password = "P@ssw0rd";
            $database = "wetag";
            
            //$this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);
            $this->connection = new mysqli($servername, $username, $password, $database);
            
            if ( mysqli_connect_errno()) {
                throw new Exception("Could not connect to database.");   
                echo "Could not connect to database.";
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());   
            echo $e;
        }           
    }
 
    /*
    public function select($query = "" , $params = [])
    {
        try {
            $stmt = $this->executeStatement( $query , $params );
            
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);               
            $stmt->close();
 
            return $result;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
        return false;
    }
    */

    public function select($query = "" ,$type, $params = [])
    {
        try {
            $stmt = $this->connection->prepare( $query );
            if($stmt === false) {
                throw New Exception("Unable to do prepared statement: " . $query);
            }
            
            if( $params ) {
                $stmt->bind_param($type, ...$params);
            }
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);               
            $stmt->close();
            
            return $result;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
        return false;
    }

    /*
    private function executeStatement($query = "" , $params = [])
    {
        try {
            $stmt = $this->connection->prepare( $query );
 
            if($stmt === false) {
                throw New Exception("Unable to do prepared statement: " . $query);
            }
 
            if( $params ) {
                $stmt->bind_param($params[0], $params[1]);
            }
 
            $stmt->execute();
 
            return $stmt;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }   
    }
    */

    public function operationStatement($query = "" ,$type, $params = [])
    {
        try {
            $stmt = $this->connection->prepare( $query );
            if($stmt === false) {
                throw New Exception("Unable to do prepared statement: " . $query);
            }
            
            if( $params ) {
                $stmt->bind_param($type, ...$params);
            }
            $stmt->execute();
            //$result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);  
            //$result = $stmt->get_result();
        
            if ($stmt) {
                $stmt->close();   
                
                $insertId = mysqli_insert_id($this->connection); 
                if ($insertId == '0')
                {
                    // action like 'update' is no id, so return true;
                    return true;
                }else
                {
                    //$insertId is the inserted item id
                    return $insertId;                    
                }

            }else
            {
                return false;
            }
       
        } catch(Exception $e) {
            
            //throw New Exception( $e->getMessage() );
            return false;
            
        }

    }

    public function executeStatement($query = "")
    {
        try {
            $stmt = $this->connection->prepare( $query );
            if($stmt === false) {
                throw New Exception("Unable to do prepared statement: " . $query);
            }
        
            $stmt->execute();
         
            if ($stmt) {
                $stmt->close();   
                
                return true;

            }else
            {
                return -1;
            }

        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
        return -1;
    }




}