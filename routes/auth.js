const {Router}      = require('express');
const User          = require('../models/user');
const bcrypt        = require('bcrypt-nodejs');
// const jwt           = require('jsonwebtoken');
const config        = require('../helpers/config');

const router = Router();

router.post('/register', (req, res) => {
    const {login, password, confirmPassword} = req.body;
    console.log(login);
    console.log(password);
    console.log(confirmPassword);
    User.findOne({login}).then(user =>{
        if (user) {
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
            else if(login.length > 10) {
                res.json({
                    ok: false,
                    caption: 'Длина логина не более 10 символов'
                })
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
                        registrationDate: new Date(),
                        nick: login,
                        avatar: '/assets/images/avatar-icon.png',
                        status: 'status here'
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
        res.json({ ok: false })
    });

});

router.post('/login', (req, res) => {
    const {login, password} = req.body;
    User.findOne({login}).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {

                    //jwt
                    // const userData = {
                    //     userID: user._id,
                    //     nick: user.nick,
                    // };
                    // const accessToken = jwt.sign(userData, config.JWT_ACCESS_TOKEN_SECRET, {expiresIn: config.JWT_ACCESS_EXPIRE});
                    // const refreshToken = jwt.sign(userData, config.JWT_REFRESH_TOKEN_SECRET, {expiresIn: config.JWT_REFRESH_EXPIRE});

                    //express-session
                    req.session.userID = user._id;
                    req.session.nick = user.nick;

                    res.json({
                        ok: true,
                        caption: 'Вход выполнен',
                        // accessToken,
                        // refreshToken,
                        user: {
                            userID: user._id,
                            nick: user.nick,
                            registrationDate: user.registrationDate,
                            avatar: user.avatar,
                            status: user.status
                        }
                    });
                }
                else {
                    res.json({
                        ok: false,
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

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(!err) {
            res.clearCookie('SSID');
            res.json({ ok: true })
        }
        else {
            res.json({
                ok: false,
                caption: err
            })
        }
    });
});

router.get('/checkSession', (req, res) => {
    if(req.signedCookies[config.COOKIE_NAME]) {
        const userID = req.session.userID;
        User.findOne({_id: userID}).then( user => {
            res.json({
                ok: true,
                user: {
                    userID: user._id,
                    nick: user.nick,
                    registrationDate: user.registrationDate,
                    avatar: user.avatar,
                    status: user.status
                }
            })
        });
    }
    else {
        res.status(401).json({ ok: false });
    }
});

// router.get('/checkToken', (req, res) => {
//     const token = (req.headers['authorization']) ? req.headers['authorization'].split(' ')[1] : null;
//     if(token) {
//         jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
//             if(err) {
//                 return res.status(401).json({
//                     ok: false,
//                     caption: 'Unauthorized. Invalid Access Token'
//                 })
//             }
//             else {
//                 const userID = decoded.userID;
//                 User.findOne({_id: userID}).then(user => {
//                     res.json({
//                         ok: true,
//                         accessToken: token,
//                         user: {
//                             userID: user._id,
//                             nick: user.nick,
//                             registrationDate: user.registrationDate,
//                             avatar: user.avatar,
//                             status: user.status
//                         }
//                     });
//                 }).catch(() => {
//                     res.status(401).json({
//                         ok: false,
//                         caption: 'Internal Server Error'
//                     });
//                 });
//
//             }
//         })
//     }
//     else {
//         res.status(401).json({
//             ok: false,
//             caption: 'Unauthorized. No Access Token'
//         })
//     }
// });


// router.post('/refreshToken', (req, res) => {
//     const token = req.body.token;
//     if(token) {
//         jwt.verify(token, config.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
//             if(err) {
//                 return res.status(401).json({
//                     ok: false,
//                     caption: 'Unauthorized. Invalid Refresh Token'
//                 })
//             }
//             else {
//                 const userData = {
//                     userID: decoded.userID,
//                     nick: decoded.nick
//                 };
//
//                 const accessToken = jwt.sign(userData, config.JWT_ACCESS_TOKEN_SECRET, {expiresIn: config.JWT_ACCESS_EXPIRE});
//                 const refreshToken = jwt.sign(userData, config.JWT_REFRESH_TOKEN_SECRET, {expiresIn: config.JWT_REFRESH_EXPIRE});
//                 return res.json({
//                     ok: true,
//                     accessToken,
//                     refreshToken
//                 })
//             }
//         })
//     }
//     else {
//         res.status(401).json({
//             ok: false,
//             caption: 'Unauthorized. No Refresh Token'
//         })
//     }
// });

module.exports = router;
