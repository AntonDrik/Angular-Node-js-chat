const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;

const schema = new Schema(
    {
        login: {
            type: String,
            required: true,
            unique: true
        },
        nick: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            required: false
        },
        registrationDate: {
            type: Date,
            required: true
        },
        avatar: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: false
        }
    }
);

module.exports = mongoose.model("User", schema);
