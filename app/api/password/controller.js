const { json, status } = require('server/reply')
const jwt = require('jsonwebtoken')
const aes256 = require('aes256')

const Password = require('../../model/Password')
const User = require('../../model/User')

module.exports = {
    getPassword: async ctx => {
        let password = await Password.findOne({_id: ctx.params.id}).populate({path: 'owner'})
        password.password = aes256.decrypt(require('../../config/app').encryptKey, password.password)
        return json(password)
    },

    createPassword: async ctx => {
        const webTokenInfo = jwt.decode(ctx.headers.authorization.split(" ")[1], {complete: true})
        const userId = webTokenInfo.payload.id;
        const params = ctx.data
        let password = new Password({
            serviceName: params.serviceName,
            password: params.password,
            owner: userId
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
        const webTokenInfo = jwt.decode(ctx.headers.authorization.split(" ")[1], {complete: true})
        const userId = webTokenInfo.payload.id;
        try {
            return json(await Password.find({owner: userId}))
        } catch(e) {
            return status(500).json(e)
        }
    }
}