//Install express server
const express           = require('express');
const path              = require('path');
let http                = require('http');
let socketIO            = require('socket.io');

const app = express();
let server = http.Server(app);
let io = socketIO(server);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/chat'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/chat/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('message', (data) => {
    console.log('[server](message): %s', JSON.stringify(data));
    // if (!data.action) {
    //   console.log('pushed');
    //   Message.create({
    //     nick: data.nick,
    //     text: data.text,
    //     date: new Date()
    //   })
    // }
    io.emit('message', data);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
