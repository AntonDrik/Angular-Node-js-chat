const Message = require('../../models/message');
const multer = require('multer');
const path = require('path');
const {rootSocket} = require('../../sockets/root');


const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('chat-files'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


exports.getMessage = function (req, res) {
  Message.find({}).sort({_id: -1}).limit(50).exec(function (err, item) {
    if (err) return console.log(err);
    res.send(item);
  });
};

exports.upload = multer({storage: storageConfig}).single('file')

exports.addMessage = function (req, res) {

  const {userID, nick, text} = req.body;
  const filePath = req.file ? req.file.filename : null;
  const date = new Date();

  Message
    .create({userID, nick, text, date, filePath})
    .then((message) => {
      rootSocket.io.emit('message', message);
      res.send();
    });
};
