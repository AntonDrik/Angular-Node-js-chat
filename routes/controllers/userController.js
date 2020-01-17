const User          = require('../../models/user');
const multer        = require('multer');
const OnlineUsers   = require('../../helpers/OnlineUsers');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "../../uploads");
    },
    filename: (req, file, cb) => {
        const login = req.session.login;
        cb(null, login+Date.now().toString());
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
        }
        else {
            res.json({
                ok: false,
                caption: 'Пользователь не найден'
            })
        }
    })
};

exports.editUser = function (req, res) {
    const {userID ,nick, nickIsEdited, status} = req.body;
    console.log(req.file);
    console.log(req.body);
    if(req.body) {
      User.findOne({nick}).then(user =>{
        if(nickIsEdited && user) {
          res.json({
            ok: false,
            user,
            caption: 'Ник занят!'
          })
        }
        else {
          User.findOneAndUpdate({_id: userID}, {nick, status}, {new: true}).then(user => {
            OnlineUsers.update(rootSocket.io);
            res.json({
              ok: true,
              caption: 'Информация обновлена',
              user: {
                userID: user._id,
                nick: user.nick,
                registrationDate: user.registrationDate,
                avatar: user.avatar,
                status: user.status
              }
            })
          })
        }
      }).catch(err => {
        res.json({
          ok: false,
          caption: 'Ошибка обновления'
        })
      });
    }
    else {
      res.json({
        ok: false,
        caption: 'No Data'
      })
    }
};
