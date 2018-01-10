const { json, status } = require('server/reply')
const aes256 = require('aes256')
const sha256 = require('sha256')
const jwt = require('jsonwebtoken')
const User = require('../../model/User')

module.exports = {
  authenticate: async ctx => {
    userInfo = ctx.data
    // Get user
    let user = await User.findOne({username: userInfo.username})
    if(!user) {
      return status(401).json("User not found")
    }

    // Check password
    let decrypt = aes256.decrypt(userInfo.password, user.password)
    if (decrypt !== sha256(userInfo.password)) {
      return status(401).json("Incorrect password")
    }

    // OK, let's create JWT
    let token = jwt.sign({id: user.id, username: user.username}, ctx.options.secret)
    return json({
      message: "User connected",
      token: token
    })
  },

  authtest: async ctx => {
    try {
      let token = ctx.headers.authorization.split(" ")[1]      
      await jwt.verify(token, ctx.options.secret)
      return json("test ok")
    } catch (e) {
      return status(401).json(e)
    }
  }
}
