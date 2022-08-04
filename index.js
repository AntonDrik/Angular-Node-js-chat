const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
let http = require('http');
const SocketIO = require('./sockets/root');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const config = require('./config');
const path = require('path');

//Database
mongoose.Promise = global.Promise;
mongoose.set('debug', process.env.NODE_ENV === 'production');
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });

mongoose.connect(config.MONGO_URL, config.MONGO_CONFIG)
  .then(() => {


    const app = express();

    app.use(cors({credentials: true}));
    app.use(bodyParser.json());
    app.use(cookieParser(config.COOKIE_SECRET));
    app.use(express.urlencoded({extended: true}));

    app.use(express.static(__dirname + '/dist/chat'));
    app.use('/static', express.static('chat-files'));
    app.use('/avatar', express.static('uploads'));

    app.use(session({
      name: config.COOKIE_NAME,
      secret: config.COOKIE_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: config.COOKIE_CONFIG,
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
    }));

    app.use('/auth', routes.auth);
    app.use('/api', routes.api);
    app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname + '/dist/chat/index.html'));
    });

    //init socket
    let server = http.createServer(app);
    SocketIO.initSocket(server);
    SocketIO.addListeners();
    server.listen(config.PORT, () => {
      console.log('Server started at port: ' + config.PORT);
    });
  })
  .catch((e) => console.log(e));
