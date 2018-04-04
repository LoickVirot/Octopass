const { json, status } = require('server/reply')
const jwt = require('jsonwebtoken')
const aes256 = require('aes256')

const Password = require('../../model/Password')
const User = require('../../model/User')
const { UnauthorizedError, DataNotFoundError } = require('../../errors/errors')

module.exports = {
    getPassword: async ctx => {
        let password
        try {
            password = await Password.findOne({_id: ctx.params.id}).populate({path: 'owner'})
        } catch (err) {
            throw new Error(err)
        }
        if (password === null) {
            throw new DataNotFoundError("Password not found")
        }
      
        // Is password owns to logged owner 
        if (password.owner._id.toString() !== ctx.user._id.toString()) {
            throw new UnauthorizedError()
        }
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
            return status(200).json(password._id)
        } catch(e) {
            return new Error(e)      
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
            throw new Error(e)
        }
    },

    dropPassword: async ctx => {
        let password
        try {
            password = await Password.findOne({ _id: ctx.params.id })
        } catch (err) {
            throw new Error(err)
        }
        if (password === null) {
            throw new DataNotFoundError("Password not found.")
        }
        if (password.owner.toString() !== ctx.user.id.toString()) {
            throw new UnauthorizedError()
        }
        try {
            await Password.remove({ _id: password._id })
            return status(200)
        } catch (err) {
            throw new Error(err)
        }
    },

    updatePassword: async ctx => {
        let password
        try {
            password = await Password.findById(ctx.params.id) 
        } catch (err) {
            throw new Error(err)
        }
        if (password === null)
            throw new DataNotFoundError("Password not found.")
        if (password.owner.toString() !== ctx.user._id.toString())
            throw new UnauthorizedError()        

        if (ctx.data.serviceName)
            password.serviceName = ctx.data.serviceName

        if (ctx.data.password)
            password.password = ctx.data.password

        password = await password.save()
        return status(201).json(password) 
    }
}