const { json, status } = require('server/reply')
const jwt = require('jsonwebtoken')
const User = require('../model/User')

module.exports = {
    isAuthenticated: async (ctx) => {
        if (ctx.headers.authorization == "" || ctx.headers.authorization == undefined) {
            error = new Error('You need to login to access to this place.')
            error.code = 'user.notAuthenticated'
            throw error;
        }
        try {
            const token = ctx.headers.authorization            
            const decoded = await jwt.verify(token, ctx.options.secret)
            ctx.user = await User.findById(decoded.id)
            ctx.req.solved = true;
        } catch (err) {
            err.code = 'user.notAuthenticated'
            throw err;
        }
    }
}