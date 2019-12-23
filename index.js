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
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/dist/chat'));
const users = [];
let server = http.createServer(app);

let io = socketIO(server, {
  pingTimeout: 5000,
  pingInterval: 5000
});

io.use((socket, next) => {
  var userName = socket.request._query['userName'];
  socket.userName = userName;
  users.push(userName);
  next();
});
app.use('/api', routes.messages);
app.use('/api', routes.auth);
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
      io.emit('updateUsers', users);

      //disconnect
      socket.on('disconnect', (reason) => {
        setTimeout(() => {
          console.log(`[server](disconnect): ${socket.userName} %s`,reason);
          users.splice(users.indexOf(socket.userName), 1);
          io.emit('updateUsers', users);
        },1000);
      });

      //update users
      socket.on('updateUsers', (data) => {
        console.log('[server](notification): %s', JSON.stringify(data));
        io.emit('updateUsers', data);
      });

      //send message
      socket.on('message', (data) => {
        console.log('[server](message): %s', JSON.stringify(data));
        Message.create({
          nick: data.nick,
          text: data.text,
          date: new Date()
        }).then(msg => {
          io.emit('message', {
            nick: msg.nick,
            text: msg.text,
            date: msg.date
          });
        });

      });
    });

    server.listen(port, () => {
      console.log('Server started at port: '+ port);
    });
  })
  .catch((e) => console.log(e));
