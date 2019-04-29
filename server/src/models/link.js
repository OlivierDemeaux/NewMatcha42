let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Link = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  tag: {
    type: Schema.Types.ObjectId,
    required: true
  },
})

module.exports = mongoose.model('link', Link)
