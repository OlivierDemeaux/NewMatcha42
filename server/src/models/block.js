let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Block = mongoose.Schema({
  blocker: {
    type: Schema.Types.ObjectId,
    required: true
  },
  blocked: {
    type: Schema.Types.ObjectId,
    required: true
  },
})

module.exports = mongoose.model('block', Block)
