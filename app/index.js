const server = require('server')
const { get, post } = server.router
const { header } = server.reply
const mongoose = require('mongoose')

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development'
}

let databaseConfig
if (process.env.NODE_ENV === 'test') {
  databaseConfig = require('./config/database.test')
} else {
  databaseConfig = require('./config/database')
}

mongoose.connect(databaseConfig, { useMongoClient: true })
mongoose.Promise = global.Promise

const cors = [
  ctx => header("Access-Control-Allow-Origin", "*"),
  ctx => header('Access-Control-Allow-Methods, "*'),
  ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"),
  ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

let app = server(
  require('./config/server'),
  cors,
  ctx => {
    ctx.mongoose = mongoose
  },
  require('./api/routes.js'),
  require('./errors/errorManager.js'),
)

console.log('env: ' + process.env.NODE_ENV)

module.exports = app
