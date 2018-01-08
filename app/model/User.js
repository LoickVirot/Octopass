const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {unique: true},
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', async function(next) {
  newUser.password = await bcrypt.hash(newUser.password, 10)
  next();
})

module.exports = mongoose.model('User', UserSchema)
