let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Message = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true
  },
  sentTime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

module.exports = mongoose.model('message', Message)
