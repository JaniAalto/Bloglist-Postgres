const router = require('express').Router()
require('express-async-errors')

const { User, Blog } = require('../models')


router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
      through: {
        attributes: []
      }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (user) {
    if (user.disabled) {
      return response.status(401).json({
        error: 'account disabled'
      })
    }
  
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read)
    where.read = req.query.read

  const users = await User.findOne({
    where: { id: req.params.id },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
      through: {
        attributes: ['id', 'read'],
        where
      }
    }
  })
  res.json(users)
})


module.exports = router