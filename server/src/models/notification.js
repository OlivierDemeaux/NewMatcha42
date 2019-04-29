let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Notification = mongoose.Schema({
  notifier: {
    type: Schema.Types.ObjectId,
    required: true
  },
  notified: {
    type: Schema.Types.ObjectId,
    required: true
  },
  notification: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    required: true,
  }
})

module.exports = mongoose.model('notification', Notification)
