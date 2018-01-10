const { get, post, put, del } = require('server/router')
const controller = require('./controller')

module.exports = [
  get('/user', ctx => controller.getUsers(ctx)),
  get('/:id/user', ctx => controller.getUser(ctx)),
  post('/user', ctx => controller.newUser(ctx)),
  put('/:id/user', ctx => controller.updateUser(ctx)),
  del('/:id/user', ctx => controller.dropUser(ctx))
]
