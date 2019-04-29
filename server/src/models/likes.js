let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Like = mongoose.Schema({
  liker: {
    type: Schema.Types.ObjectId,
    required: true
  },
  liked: {
    type: Schema.Types.ObjectId,
    required: true
  },
})

module.exports = mongoose.model('like', Like)
