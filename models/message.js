const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;

const schema = new Schema(
    {
        nick: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }
);

module.exports = mongoose.model("Message", schema);

