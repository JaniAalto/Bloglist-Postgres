const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

//Blog.sync({ alter: true })
//User.sync({ alter: true })

User.belongsToMany(Blog, { through: Readinglist })
Blog.belongsToMany(User, { through: Readinglist })

module.exports = {
  Blog, User
}