scp -r /local/inc ubuntu@ec2-18-163-129-246.ap-east-1.compute.amazonaws.com:/var/www/html/


scp README.txt ubuntu@ec2-18-163-129-246.ap-east-1.compute.amazonaws.com:/var/www/html/


scp -i "ssh.pem" ./README.txt ubuntu@ec2-18-163-129-246.ap-east-1.compute.amazonaws.com:/var/www/html/

================================


ssh -i "ssh.pem" ubuntu@ec2-18-163-129-246.ap-east-1.compute.amazonaws.com
scp -i "ssh.pem" -r wetag ubuntu@ec2-18-163-129-246.ap-east-1.compute.amazonaws.com:/home/ubuntu/.

sudo mv ./wetag /var/www/html/
sudo mv /home/ubuntu/wetag /var/www/html/

sudo cp -rp /home/ubuntu/wetag /var/www/html/
sudo rm -r /var/www/html/wetag

node /var/www/html/wetag/socket/game_socket.js &
node /var/www/html/wetag/socket/index.js &

log:
cat /var/log/apache2/error.log 


=================================
Server Command

check port:
ps aux | grep node
ps -ef | grep php
kill -9 PID


cd server
php -S 127.0.0.1:8090

Socket Server
change IP of your API Server's ip.
cd server
node socket.js