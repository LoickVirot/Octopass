const { json, status } = require('server/reply')
const User = require('../../model/User')
const { UnauthorizedError } = require('../../errors/errors')

module.exports = {
  getUsers: async ctx => {
    let users = await User.find({})
    return json(users)
  },

  getUser: async ctx => {
    try {
      return json(await User.findById(ctx.params.id))
    } catch (err) {
      return status(400).json(err)
    }
  },

  newUser: async ctx => {
    newUser = new User(ctx.data)
    try{
      await newUser.save()
    } catch(err) {
      return status(400).json(err)
    }
    return json(newUser.username)
  },

  updateUser: async ctx => {
    if ('' + ctx.user._id !== '' + ctx.params.id) {
      throw new UnauthorizedError()
    }
    let user = await User.findById(ctx.params.id)
    user.username = ctx.data.username
    try {
      return json(await user.save())
    } catch (err) {
      return status(400).json(err)
    }
  },

  dropUser: async ctx => {
    if ('' + ctx.user._id !== '' + ctx.params.id) {
      throw new UnauthorizedError()
    }
    try {
      await User.findById(ctx.params.id).remove()
    } catch(err) {
      return status(400).json(err)
    }
    return json("User " + ctx.params.id + " deleted")
  }
}
