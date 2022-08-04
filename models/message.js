const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  user: [{type: Schema.Types.ObjectId, ref: 'User'}],
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

