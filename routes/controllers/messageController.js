const Message = require('../../models/message');
const User = require('../../models/user');
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
  Message
    .find({})
    .populate('user', 'nick avatar')
    .sort({_id: -1})
    .limit(20)
    .exec(function (err, item) {
      res.send(item);
    });
};

exports.upload = multer({storage: storageConfig}).single('file')

exports.addMessage = async function (req, res) {

  const {userID, text} = req.body;
  const filePath = req.file ? req.file.filename : null;

  const user = await User.findOne({_id: userID});
  const message = new Message();
  message.date = new Date();
  message.text = text;
  message.filePath = filePath;
  message.user = user;
  await message.save();
  rootSocket.io.emit('message', {...message._doc, user: [user]});
  res.send();

  // Message.remove({}, () => {
  //   User.remove({}, () => {
  //     res.send();
  //   })
  // })

};
