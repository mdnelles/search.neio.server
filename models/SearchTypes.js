const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'search_types',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ttype: {
      type: Sequelize.STRING
    },
  },
  {
    timestamps: false
  }
)