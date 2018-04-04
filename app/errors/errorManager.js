const { error } = require("server/router") 
const { status, json } = require("server/reply") 

module.exports = [
    error('user.notAuthenticated', ctx => {
        return status(401).json(ctx.error.message)
    }),
    error('user.unauthorized', ctx => {
        return status(401).json(ctx.error.message)
    }),
    error('data.notfound', ctx => {
        return status(404).json(ctx.error.message)
    }),
    error(ctx => {
        console.error(ctx.error)
        return status(500).json("Internal server error")
    })
]