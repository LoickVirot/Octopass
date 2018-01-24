const { get, post, put, del } = require('server/router')
const controller = require('./controller')
const { isAuthenticated } = require('../../middleware/authentication')

module.exports = [
  get('/:id/password', isAuthenticated, ctx => controller.getPassword(ctx)),
  get('/user/passwords', isAuthenticated, ctx => controller.getUsersPasswords(ctx)),
  post('/password', isAuthenticated, ctx => controller.createPassword(ctx)),
]
