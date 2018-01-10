const mongoose = require('mongoose')
const aes256 = require('aes256')
var Schema = mongoose.Schema;

var PasswordSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

PasswordSchema.pre('save', async function(next) {
    // We expected client-side encrypted data, but we encrypt it client side to avoid password in clear into database
    key = require('../config/app.js').encryptKey
    this.password = aes256.encrypt(key, this.password)
    next()
})

module.exports = mongoose.model('Password', PasswordSchema)
