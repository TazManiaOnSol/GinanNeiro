var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server),
    users = [];

// Specify the HTML we will use
app.use('/', express.static(__dirname + '/www'));

// Bind the server to the specified port
server.listen(process.env.PORT || 3000); // publish to Heroku

// Handle socket connections
io.sockets.on('connection', function(socket) {
    // New user login
   // New user login
// New user login
socket.on('login', function(nickname) {
    if (users.indexOf(nickname) > -1) {
        socket.emit('nickExisted');
    } else {
        socket.nickname = nickname;
        users.push(nickname);
        socket.emit('loginSuccess');
        // Emit to all sockets
        io.sockets.emit('system', nickname, users.length, 'login');
    }
});

// User leaves
socket.on('disconnect', function() {
    if (socket.nickname != null) {
        users.splice(users.indexOf(socket.nickname), 1);
        // Emit to all sockets
        io.sockets.emit('system', socket.nickname, users.length, 'logout');
    }
});

// List tokens
socket.on('listTokens', function(adData) {
    // Broadcast the token list to all clients except the current one
    socket.broadcast.emit('listTokens', adData);
});

// New message received
socket.on('postMsg', function(msg, color) {
    // Emit only to other sockets
    socket.broadcast.emit('newMsg', socket.nickname, msg, color);
});

// New image received
socket.on('newImg', function(imgData, color) {
    // Emit only to other sockets
    socket.broadcast.emit('newImg', socket.nickname, imgData, color);
});

// Handle new ad creation
socket.on('createAd', function(adData) {
    // Broadcast the new ad data to all clients
    io.sockets.emit('newAd', adData);
});

});
