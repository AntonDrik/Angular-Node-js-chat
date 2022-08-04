const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userID: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    filePath: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Message", schema);

