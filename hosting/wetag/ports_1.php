<?php

//$host = 'wetag.000webhostapp.com';
$host = 'localhost';
$ports = array(21, 25, 80, 81, 110, 443, 3000, 3306, 8090);

foreach ($ports as $port)
{
    $connection = @fsockopen($host, $port);

    if (is_resource($connection))
    {
        echo '<h2>' . $host . ':' . $port . ' ' . '(' . getservbyport($port, 'tcp') . ') is open.</h2>' . "\n";

        fclose($connection);
    }

    else
    {
        echo '<h2>' . $host . ':' . $port . ' is not responding.</h2>' . "\n";
    }
}

?>