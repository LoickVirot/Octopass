const { get, post, put, del } = require('server/router')
const controller = require('./controller')

module.exports = [
  get('/passwords', ctx => controller.getPasswords(ctx)), // tests    
  get('/password/:id', ctx => controller.getPassword(ctx)),
  get('/password/user/:userId', ctx => controller.getUserPasswords(ctx)),    
  post('/password', ctx => controller.createPassword(ctx)),
]
