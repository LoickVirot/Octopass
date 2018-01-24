const { json, status } = require('server/reply')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const { NotAuthenticatedError } = require('../errors/errors')

module.exports = {
    isAuthenticated: async (ctx) => {
        if (ctx.headers.authorization == "" || ctx.headers.authorization == undefined) {            
            throw new NotAuthenticatedError()
        }
        try {
            const token = ctx.headers.authorization            
            const decoded = await jwt.verify(token, ctx.options.secret)
            ctx.user = await User.findById(decoded.id)
            if (ctx.user == null) {
                throw new NotAuthenticatedError()
            }
        } catch (err) {
            throw new NotAuthenticatedError()
        }
    }
}