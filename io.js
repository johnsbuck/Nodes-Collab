var Server = require('socket.io');

var io = new Server();

var usernames = {};
var room = {};
room['general'] = {};

io.sockets.on('connection', function(socket) {
  socket.on('sendchat', function(data) {
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });

  socket.on('adduser', function(username, otheruser) {
    socket.username = username;

    if(!usernames[otheruser]) {
      otheruser = null;
    }

    if(typeof otheruser !== 'string') {
      console.log('GENERAL');
      socket.room = 'general';
      socket.join(socket.room);
      socket.emit('updatechat', 'SERVER', 'You have entered the general chat.<br> You may click on another user to have a private conversation.');

    } else if(room[otheruser + '+' + username]) {
      console.log('JOINED ROOM' + otheruser + '+' + username);
      socket.room = otheruser + '+' + username;
      socket.join(socket.room);
      socket.emit('updatechat', 'SERVER', 'You have entered a conversation with ' + otheruser + '.');
    } else {
      console.log('NEW ROOM' + otheruser + '+' + username);
      socket.room = username + '+' + otheruser;
      room[socket.room] = {};
      socket.join(socket.room);
      socket.emit('updatechat', 'SERVER', 'You have started a conversation with ' + otheruser + '.');
      if(usernames[otheruser]) {
        io.sockets.connected[usernames[otheruser]].emit('updatechat', 'SERVER', username + ' wants to start a conversation with you!');
      }
    }

    usernames[username] = socket.id;
    socket.broadcast.emit('updateusers', {'username': socket.username,'users': Object.keys(usernames), 'otheruser': null});


    room[socket.room][username] = username;

    console.log(socket.room + ' + ' + Object.keys(room[socket.room]));

    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', username + ' has connected.');

    console.log("OTHER USER: " + otheruser);
    var data = {'username': socket.username, 'users': Object.keys(usernames), 'otheruser': otheruser};

    io.sockets.in(socket.room).emit('updateusers', data);
  });

  socket.on('switchRoom', function(otheruser){
  		// leave the current room (stored in session)
  		socket.leave(socket.room);
      delete room[socket.room][username];
      if(Object.keys(room[socket.room]).length == 0 && socket.room !== 'general') {
        delete room[socket.room];
      }
      // sent message to OLD room
  		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username +' has left this conversation.');
  		// join new room, received as function parameter

      if(!username[otheruser]) {
        otheruser = null;
      }

      if(typeof otheruser !== 'string') {
        console.log('GENERAL');
        socket.room = 'general';
        socket.join(socket.room);
        socket.emit('updatechat', 'SERVER', 'You have entered the general chat.<br> You may click on another user to have a private conversation.');

      } else if(room[otheruser + '+' + username]) {
        console.log('JOINED ROOM' + otheruser + '+' + username);
        socket.room = otheruser + '+' + username;
        socket.join(socket.room);
        socket.emit('updatechat', 'SERVER', 'You have entered a conversation with ' + otheruser + '.');
      } else {
        console.log('NEW ROOM' + otheruser + '+' + username);
        socket.room = username + '+' + otheruser;
        room[socket.room] = {};
        socket.join(socket.room);
        socket.emit('updatechat', 'SERVER', 'You have started a conversation with ' + otheruser + '.');
        if(usernames[otheruser]) {
          io.sockets.connected[usernames[otheruser]].emit('updatechat', 'SERVER', username + ' wants to start a conversation with you!');
        }
      }

  		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username +' has joined this conversation.');
  		socket.emit('updaterooms', rooms, newroom);
  	});


  socket.on('disconnect', function() {
    delete room[socket.room][socket.username];
    delete usernames[socket.username];
    io.sockets.in(socket.room).emit('updateusers', {'username': socket.username,'users': Object.keys(usernames), 'otheruser': null});

    if(Object.keys(room[socket.room]).length == 0 && socket.room !== 'general') {
      delete room[socket.room];
    }

    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected.');
  });
});

module.exports = io;
