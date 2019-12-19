const express           = require('express');
const mongoose          = require('mongoose');
const bodyParser        = require('body-parser');
const cors              = require('cors');
const routes            = require('./routes');
let http                = require('http');
let socketIO            = require('socket.io');
const Message           = require('./models/message');
const path              = require('path');

const port = process.env.PORT || 8080;
const app = express();
let server = http.createServer(app);

let io = socketIO(server, {
  pingTimeout: 10000,
  pingInterval: 10000
});

io.use((socket, next) => {
  var handshakeData = socket.request;
  socket.userName = handshakeData._query['userName'];
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api', routes.messages);
app.use(express.static(__dirname + '/dist/chat'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/chat/index.html'));
});

mongoose.connect(
    'mongodb+srv://AntonDrik:gjgjrfntgtnkm1245@bruschat-8kcu6.mongodb.net/chat',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((res) => {

      io.on('connect', (socket) => {

        //connect
        console.log(`[server](connect): ${socket.userName} connected`);
        socket.broadcast.emit('message', {
          nick: socket.userName,
          text: 'online',
          action: 'connect'
        });

        //disconnect
        socket.on('disconnect', (reason) => {
          setTimeout(() => {
            console.log(`[server](disconnect): ${socket.userName} %s`,reason);
            socket.broadcast.emit('message', {
              nick: socket.userName,
              text: 'offline',
              action: 'disconnect'
            })
          },1000);
        });

        //send message
        socket.on('message', (data) => {
          console.log('[server](message): %s', JSON.stringify(data));
          if (!data.action) {
            Message.create({
              nick: data.nick,
              text: data.text,
              date: new Date()
            })
          }
          io.emit('message', data);
        });

      });

      server.listen(port, () => {
        console.log('Server started at port: '+ port);
      });
    })
    .catch((e) => console.log(e));

