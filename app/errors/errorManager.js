const { error } = require("server/router") 
const { status, json } = require("server/reply") 

module.exports = [
    error('user', ctx => {
        return status(401).json(ctx.error.message)
    }),
    error(ctx => {
        console.error("UNHANDLED ERROR")        
        console.error(ctx.error)
        return status(401).json(ctx.error.message)
    })
]