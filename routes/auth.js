const {Router}      = require('express');
const User          = require('../models/user');
const bcrypt        = require('bcrypt-nodejs');

const router = Router();

router.post('/login', (req, res) => {
    const {login, password} = req.body;
    User.findOne({login}).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.json({
                        ok: true,
                        caption: 'Пароль верный'
                    })
                }
                else {
                    res.json({
                        ok: true,
                        caption: 'Неверный логин или пароль'
                    })
                }
            });
        }
        else {
            res.json({
                ok: false,
                caption: 'Неверный логин или пароль'
            })
        }
    })
});

router.post('/register', (req, res) => {
    const {login, password, confirmPassword} = req.body;
    console.log(login);
    console.log(password);
    console.log(confirmPassword);
    User.findOne({login}).then(user =>{
        if (user) {
            console.log('Имя занято');
            res.json({
                ok: false,
                caption: 'Имя уже занято!'
            })
        }
        else {
            if (!login || !password || !confirmPassword) {
                res.json({
                    ok: false,
                    caption: 'Все поля должны быть заполнены'
                });
            }
            else if (password.length < 6) {
                res.json({
                    ok: false,
                    caption: 'Длина пароля не менее 6 символов'
                })
            }
            else if (password !== confirmPassword){
                res.json({
                    ok: false,
                    caption: 'Пароли не совпадают'
                })
            }
            else {
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
        }
    }).catch(err => {
        res.json({ok: false})
    });

});

module.exports = router;
