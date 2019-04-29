let mongoose = require('mongoose')
let bcrypt = require('bcrypt')

// Article Schema
let UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  interestedIn: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  lastName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  popularity: {
    type: Number,
    default: 0,
    required: true
  },
  last_log: {
    type: Date,
    required: true,
    default: Date.now
  },
  picture1: {
    type: String,
    default: 'images/default.jpg',
    required: true
  },
  picture2: {
    type: String,
    default: 'images/default.jpg',
    required: true
  },
  picture3: {
    type: String,
    default: 'images/default.jpg',
    required: true
  },
  picture4: {
    type: String,
    default: 'images/default.jpg',
    required: true
  },
  picture5: {
    type: String,
    default: 'images/default.jpg',
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  }
})

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('user', UserSchema)
