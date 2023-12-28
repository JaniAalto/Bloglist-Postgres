require('express-async-errors')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Session = require('../models/session')
const { User } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)

      const session = await Session.findOne({ where: { 'userId': req.decodedToken.id } })
      console.log("session", session)
      if (session) {
        console.log("token, session.currentToken", token, session.currentToken)
        const user = await User.findByPk(req.decodedToken.id)
        if (token === session.currentToken && !user.disabled)
          req.sessionValid = true
      }

    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }