let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Tag = mongoose.Schema({
  tag: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('tag', Tag)
