const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model { }

const today = new Date()
const currentYear = today.getFullYear()

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1991,
      max: currentYear
    }
  }
}, {
  sequelize,
  underscored: true,
  //timestamps: false,
  modelName: 'blog'
})

module.exports = Blog