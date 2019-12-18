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
// let server = http.Server(app);
let io = socketIO(app);

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

      app.listen(port, () => {
        console.log('Server started at port: '+ port);
      });

        io.on('connection', (socket) => {
            console.log('Client connected');
            socket.on('message', (data) => {
                console.log('[server](message): %s', JSON.stringify(data));
                if (!data.action) {
                    console.log('pushed');
                    Message.create({
                        nick: data.nick,
                        text: data.text,
                        date: new Date()
                    })
                }
                io.emit('message', data);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    })
    .catch((e) => console.log(e));

