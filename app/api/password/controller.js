const { json, status } = require('server/reply')
const jwt = require('jsonwebtoken')

const Password = require('../../model/Password')
const User = require('../../model/User')

module.exports = {
    getPassword: ctx => {
        return status(500).json("Not implemented");
    },

    getUserPasswords: ctx => {
        return status(500).json("Not implemented");
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
    }
}