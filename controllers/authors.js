const router = require('express').Router()
require('express-async-errors')

const { Blog } = require('../models')
const sequelize = require('sequelize')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('url')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: ['author']
  })
  res.json(blogs)
})

module.exports = router