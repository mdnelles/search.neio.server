const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
   "todo",
   {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      title: {
         type: Sequelize.STRING,
      },
      details: {
         type: Sequelize.STRING,
      },
      due: {
         type: Sequelize.STRING,
      },
      createAt: {
         type: Sequelize.DATE,
      },
      updatedAt: {
         type: Sequelize.DATE,
      },
   },
   {
      timestamps: true,
   }
);
