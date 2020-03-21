const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'search',
   {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },
      ttype: {
         type: Sequelize.STRING
      },
      title: {
         type: Sequelize.STRING
      },
      keywords: {
         type: Sequelize.STRING
      },
      intro: {
         type: Sequelize.STRING
      },
      code: {
         type: Sequelize.STRING
      },
      date1: {
         type: Sequelize.STRING
      },
      date2: {
         type: Sequelize.STRING
      },
      isDeleted: {
         type: Sequelize.INTEGER,
         defaultValue: 0
      },
      image: {
         type: Sequelize.STRING
      }
   },
   {
      timestamps: false
   }
);
