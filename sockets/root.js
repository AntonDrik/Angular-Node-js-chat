let socketIO            = require('socket.io');
const OnlineUsers       = require('../helpers/OnlineUsers');
const Message           = require('../models/message');

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

        //connect
        console.log(`[server](connect): ${socket.nick} connected`);
        OnlineUsers.update(rootSocket.io);

        //disconnect
        socket.on('disconnect', (reason) => {
            setTimeout(() => {
                console.log(`[server](disconnect): ${socket.nick} %s`,reason);
                OnlineUsers.remove(socket.userID, rootSocket.io);
            },1000);
        });

        //send message
        socket.on('message', (data) => {
            console.log('[server](message): %s', JSON.stringify(data));
            Message.create({
                userID: data.userID,
                nick: data.nick,
                text: data.text,
                date: new Date()
            }).then(msg => {
                rootSocket.io.emit('message', {
                    userID: msg.userID,
                    nick: msg.nick,
                    text: msg.text,
                    date: msg.date
                });
            });

        });

    });
}

module.exports = { rootSocket, initSocket, addListeners };
