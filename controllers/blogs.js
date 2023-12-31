const router = require('express').Router()
require('express-async-errors')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/tokenExtractor')


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      [Op.or]: [
        {
          title: { [Op.substring]: req.query.search ? req.query.search : '' }
        },
        {
          author: { [Op.substring]: req.query.search ? req.query.search : '' }
        }
      ]
    },
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    //console.log(req.blog.toJSON())
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.post('/', tokenExtractor, async (req, res) => {
  //console.log(req.body)
  if (req.sessionValid) {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } else {
    res.status(401).end()
  }
})

router.put('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog) {
    if (req.sessionValid) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog.likes)
    } else {
      res.status(401).end()
    }
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog) {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog.userId === user.id && req.sessionValid) {
      await req.blog.destroy()
    } else {
      res.status(401).end()
    }
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})


module.exports = router