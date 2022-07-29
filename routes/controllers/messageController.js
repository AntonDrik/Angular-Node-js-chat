const Message = require('../../models/message');

exports.getMessage = function (req, res) {
    Message.find({}).sort({ _id: -1 }).limit(40).exec(function (err, item) {
        if(err) return console.log(err);
        res.send(item);
    });
};

exports.addMessage = function(req, res) {
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
};
