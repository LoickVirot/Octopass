const { get, post, put, del } = require('server/router')
const controller = require('./controller')

module.exports = [
  get('/passwords', ctx => controller.getPasswords(ctx)), // tests    
  get('/:id/password', ctx => controller.getPassword(ctx)),
  get('/user/passwords', ctx => controller.getUsersPasswords(ctx)),
  post('/password', ctx => controller.createPassword(ctx)),
]
