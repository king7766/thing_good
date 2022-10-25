const express = require('express');
const { emit } = require('process');
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3001;
const SOCKET_JOIN = 'server/join';
const SOCKET_ACTION = 'server/action';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected : '+socket.id);
  /*
  socket.on('server/action', msg=>{
    console.log("Receiving msg ... : ");
    console.log(msg);

    //socket.join(msg.data.roomId);
    //socket.broadcast.to(msg.data.roomId).emit(msg);

    io.emit('server/action', msg);
  })
  */

  socket.on(SOCKET_ACTION, (msg, roomId)=>{
    console.log("Receiving msg, to "+roomId+" ... : ");
    console.log(msg);
    console.log(roomId);

    if(roomId ==='')
    {
      io.emit(SOCKET_ACTION, msg);
    }
    else{
      io.to(roomId).emit(SOCKET_ACTION, msg);

    }
    
    //socket.join(msg.data.roomId);
    //socket.broadcast.to(msg.data.roomId).emit(msg);
    //io.emit('server/action', msg);
  })

  socket.on(SOCKET_JOIN, (msg, roomId)=>{
    socket.join(roomId);
    console.log("joining room, ... : " + roomId);
    io.to(roomId).emit(SOCKET_ACTION, msg);

  })


});

server.listen(port, () => {
  console.log('listening on *: '+ port);
});


/*
io.use((socket, next)=>{
  const sessionID = socket.handshake.auth.sessionID;
  
})
*/
