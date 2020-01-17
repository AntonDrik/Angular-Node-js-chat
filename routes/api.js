const {Router}      = require('express');
const config        = require('../config');
// const jwt           = require('express-jwt');
const router        = Router();

// CONTROLLERS
const messageController = require('./controllers/messageController');
const userController    = require('./controllers/userController');

// ACCESS TO ROUTER VIA JWT
// router.use(jwt({secret: config.JWT_ACCESS_TOKEN_SECRET}), function(req, res, next) {
//     next();
// });

// ACCESS TO ROUTER VIA SESSION
router.use((req, res, next) => {
    const SSID = req.signedCookies[config.COOKIE_NAME];
    if(SSID) {
        next();
    }
    else {
        res.status(401).json({ ok: false })
    }
});


// MESSAGES ROUTES
router.get('/messages/get', messageController.getMessage);
router.get('/messages/add', messageController.addMessage);

// USER ROUTES
router.get('/user/:userID', userController.getUser);
router.post('/user/edit', userController.upload, userController.editUser);



module.exports = router;
