const server = require('server')
const { get, post } = server.router
const { header } = server.reply
const mongoose = require('mongoose')

mongoose.connect(require('./config/database'), { useMongoClient: true })
mongoose.Promise = global.Promise

const cors = [
  ctx => header("Access-Control-Allow-Origin", "*"),
  ctx => header('Access-Control-Allow-Methods, "*'),
  ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"),
  ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

server(
  require('./config/server'),
  cors,
  ctx => {
    ctx.mongoose = mongoose
  },
  require('./api/routes.js'),
  require('./errors/errorManager.js'),
)
