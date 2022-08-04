let socketIO = require('socket.io');
const OnlineUsers = require('../helpers/OnlineUsers');

const rootSocket = {
  io: null
};

function initSocket(server) {
  rootSocket.io = socketIO(server, {
    pingTimeout: 10000,
    pingInterval: 10000
  });

  rootSocket.io.use((socket, next) => {
    const userID = socket.handshake.query.userID;
    const nick = socket.handshake.query.userName;
    socket.userID = userID;
    socket.nick = nick;
    OnlineUsers.add(userID);
    next();
  });
}

function addListeners() {
  rootSocket.io.on('connect', (socket) => {

    console.log(`[server](connect): ${socket.nick} connected`);
    OnlineUsers.update(rootSocket.io);

    socket.on('disconnect', (reason) => {
      setTimeout(() => {
        console.log(`[server](disconnect): ${socket.nick} %s`, reason);
        OnlineUsers.remove(socket.userID, rootSocket.io);
      }, 1000);
    });

  });
}

module.exports = {rootSocket, initSocket, addListeners};
