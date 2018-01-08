const { get, post, put, del } = require('server/router')
const controller = require('./controller')

module.exports = [
  get('/user', ctx => controller.getUsers(ctx)),
  get('/user/:id', ctx => controller.getUser(ctx)),
  post('/user', ctx => controller.newUser(ctx)),
  put('/user/:id', ctx => controller.updateUser(ctx)),
  del('/user/:id', ctx => controller.dropUser(ctx))
]
