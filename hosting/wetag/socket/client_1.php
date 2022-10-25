<html>
    <body>
        <div alig='center'></div>
        <form method='POST'>
            <table>
                <tr>
                    <td>
                        <label>Enter message</label>
                        <input type="text" name="txtMessage">
                        <input type="submit" name="btnSend" value="Send">
                    </td>
                </tr>
                <?php
                    $host="localhost";
                    $port=3000;

                    if(isset($_POST['btnSend']))
                    {
                        $msg = $_REQUEST['txtMessage'];
                        $sock = socket_create(AF_INET, SOCK_STREAM, 0);
                        socket_connect($sock, $host, $port);
                        socket_write($sock, $msg , strlen($msg));

                        $reply = socket_read($sock, 1924);
                        $reply = trim($reply);
                        $reply = "Server says:\t".$reply;
                    }
                ?>
                <tr>
                    <td>
                        <textarea rows = '10' col='30'><?php echo @$reply; ?>
                        </textarea>
                    </td>
                </tr>
            </table>
        </form>
        </div>
    </body>
</html>


