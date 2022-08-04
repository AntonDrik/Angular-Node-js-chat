const {Router} = require('express');
const config = require('../config');
const router = Router();

// CONTROLLERS
const messageController = require('./controllers/messageController');
const userController = require('./controllers/userController');


// ACCESS TO ROUTER VIA SESSION
router.use((req, res, next) => {
  const SSID = req.signedCookies[config.COOKIE_NAME];
  if (SSID) {
    next();
  } else {
    res.status(401).json({ok: false})
  }
});


// MESSAGES ROUTES
router.get('/messages/get', messageController.getMessage);
router.post('/messages/add', messageController.upload, messageController.addMessage);

// USER ROUTES
router.get('/user/get/:userID', userController.getUser);
router.post('/user/edit', userController.upload, userController.editUser);


module.exports = router;
