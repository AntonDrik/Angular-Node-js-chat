const {Router}      = require('express');
const User          = require('../models/user');
const bcrypt        = require('bcrypt-nodejs');

const router = Router();

router.post('/register', (req, res) => {
  const {login, password, confirmPassword} = req.body;

  console.log(login);
  console.log(password);
  console.log(confirmPassword);
  if (!login || !password || !confirmPassword) {
    res.json({
      ok: false,
      caption: 'Все поля должны быть заполнены'
    });
  } else if (password.length < 6) {
    res.json({
      ok: false,
      caption: 'Длина пароля не менее 6 символов'
    })
  } else if (password !== confirmPassword){
    res.json({
      ok: false,
      caption: 'Пароли не совпадают'
    })
  } else {
    bcrypt.hash(password, null, null, (err, hash) => {
      User.create({
        login,
        password: hash,
        registrationDate: new Date()
      }).then(user => {
        console.log(user);
        res.json({
          ok:true,
          caption: 'Регистрация успешно завершена!'
        });
      }).catch(err => {
        console.log(err);
        res.json({
          ok: false,
          caption: 'Ошибка регистрации. Попробуйте позже!'
        })
      });
    });
  }

});

module.exports = router;
