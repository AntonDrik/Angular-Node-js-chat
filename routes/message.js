const {Router}      = require('express');
// const multer        = require("multer");
const Message       = require('../models/message');

const router = Router();

router.get('/messages', (req,res) => {
    // Message.deleteMany({});
    Message.find({}).sort({ _id: -1 }).limit(20).exec(function (err, item) {
        if(err) return console.log(err);
        console.log(item);
        res.send({item});
    });
});

// router.post('/messages/add', (req, res) => {
//     const {nick, text} = req.body;
//     Message.create({
//         nick,
//         text,
//         date: new Date()
//     }).then(_ => {
//         Message.find({}).sort({ _id: -1 }).limit(20).exec(function (err, item) {
//             if(err) return console.log(err);
//             res.send(item);
//         });
//     });
// });

module.exports = router;
