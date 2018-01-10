const mongoose = require('mongoose')
const errors = require('errors')
const aes256 = require('aes256')
const sha256 = require('sha256')

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {unique: true},
    required: true
  },
  email: {
    type: String,
    validate: {
      validator: function(string) {
        var EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return EMAIL_REGEX.test(string)
      },
      message: "Invalid email address"
    },
    index: {unique: true},
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', async function(next) {
  key = this.password
  newUser.password = aes256.encrypt(key, sha256(key))
  next()
})

module.exports = mongoose.model('User', UserSchema)
