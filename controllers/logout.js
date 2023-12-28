const router = require('express').Router()

const Session = require('../models/session')
const { tokenExtractor } = require('../util/tokenExtractor')

router.delete('/', tokenExtractor, async (req, res) => {
  console.log("req.decodedToken.id", req.decodedToken.id)
  const session = await Session.findOne({ where: { 'userId': req.decodedToken.id } })
  await session.destroy()

  res.status(204).end()
})

module.exports = router