const server = require('server')
const { get, post } = server.router
const mongoose = require('mongoose')

mongoose.connect(require('./config/database'), { useMongoClient: true })
mongoose.Promise = global.Promise

server(
  require('./config/server'),
  ctx => {
    ctx.mongoose = mongoose
  },
  require('./api/routes.js'),
  require('./errors/errorManager.js'),
)
