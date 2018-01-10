const mongoose = require('mongoose')
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

module.exports = mongoose.model('Password', PasswordSchema)
