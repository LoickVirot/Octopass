const { json, status } = require('server/reply')
const jwt = require('jsonwebtoken')
const aes256 = require('aes256')

const Password = require('../../model/Password')
const User = require('../../model/User')
const { UnauthorizedError, NotFoundError } = require('../../errors/errors')

module.exports = {
    getPassword: async ctx => {
        let password
        try {
            password = await Password.findOne({_id: ctx.params.id}).populate({path: 'owner'})
        } catch (err) {
            throw new Error(err)
        }
        if (password === null)
            throw new NotFoundError("Password cannot be found")
        // Is password owns to logged owner 
        if ('' + password.owner._id !== '' + ctx.user._id) {
            throw new UnauthorizedError()
        }
        password.password = aes256.decrypt(require('../../config/app').encryptKey, password.password)
        return json(password)
    },

    createPassword: async ctx => {
        const params = ctx.data
        let password = new Password({
            serviceName: params.serviceName,
            password: params.password,
            owner: ctx.user._id
        })
        try {
            await password.save()
            return status(200)
        } catch(e) {
            return status(500).json(e)      
        }
    },

    getPasswords: async ctx => {
        let passwords = await Password.find({}).populate({path: 'owner'})
        return json(passwords)
    },

    getUsersPasswords: async ctx => {
        try {
            return json(await Password.find({owner: ctx.user._id}, {password: 0, owner: 0}))
        } catch(e) {
            return status(500).json(e)
        }
    }
}