const { get, post, put, del } = require('server/router')
const controller = require('./controller')

module.exports = [
  post('/auth', ctx => controller.authenticate(ctx)),
  get('/authtest', ctx => controller.authtest(ctx)),
]
