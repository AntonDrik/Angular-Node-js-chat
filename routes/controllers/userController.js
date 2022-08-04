const User = require('../../models/user');
const multer = require('multer');
const OnlineUsers = require('../../helpers/OnlineUsers');
const {rootSocket} = require('../../sockets/root');
const path = require('path');

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

exports.upload = multer({storage: storageConfig}).single('avatar');

exports.getUser = function (req, res) {
  const userID = req.params.userID;
  User.findOne({_id: userID}).then(user => {
    if (user) {
      res.json({
        ok: true,
        user: {
          nick: user.nick,
          registrationDate: user.registrationDate,
          avatar: user.avatar,
          status: user.status
        }
      })
    } else {
      res.json({
        ok: false,
        caption: 'Пользователь не найден'
      })
    }
  })
};

exports.editUser = async function (req, res) {
  const {userID, nick, status} = req.body;
  console.log(req.file);
  console.log(req.body);
  if (!req.body) {
    return res.json({ok: false, caption: 'Неверные данные'});
  }

  const user = await User.findOne({nick});
  if (String(user._id) !== String(userID)) {
    return res.json({ok: false, user, caption: 'Ник занят!'});
  }

  const updateObject = {nick, status};
  const avatarIsEdited = req.file && (user.avatar !== req.file.filename);
  if (avatarIsEdited) {
    updateObject.avatar = req.file.filename
  }

  User.findOneAndUpdate({_id: userID}, updateObject).then((user) => {
    OnlineUsers.update(rootSocket.io);
    res.json({
      ok: true,
      caption: 'Информация обновлена',
      user: {
        userID: user._id,
        nick: user.nick,
        registrationDate: user.registrationDate,
        avatar: req.file.filename,
        status: user.status
      }
    })
  }).catch(() => {
    res.json({ok: false, caption: 'Ошибка обновления'})
  });
};
