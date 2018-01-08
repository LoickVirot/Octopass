const { json, status } = require('server/reply')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
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
    if (!await bcrypt.compare(userInfo.password, user.password)) {
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
    let token = ctx.headers.authorization.split(" ")[1]
    try {
      await jwt.verify(token, ctx.options.secret)
      return json("test ok")
    } catch (e) {
      return status(401).json(e)
    }
  }
}
