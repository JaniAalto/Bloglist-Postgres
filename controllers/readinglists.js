const router = require('express').Router()
require('express-async-errors')

const { User } = require('../models')
const Readinglist = require('../models/readinglist')
const { tokenExtractor } = require('../util/tokenExtractor')

router.post('/', async (req, res) => {
  //console.log("req.body", req.body)
  const readinglist = await Readinglist.create(req.body)
  res.json(readinglist)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readinglist = await Readinglist.findByPk(req.params.id)
  //console.log("readinglist", readinglist)
  if (readinglist) {
    const user = await User.findByPk(req.decodedToken.id)
    //console.log("user", user)
    if (readinglist.userId === user.id && !user.disabled) {
      readinglist.read = req.body.read
      await readinglist.save()
      res.json(readinglist.read)
    } else {
      res.status(401).end()
    }
  } else {
    res.status(404).end()
  }
})

router.get('/', async (req, res) => {
  const readinglists = await Readinglist.findAll()
  res.json(readinglists)
})

module.exports = router