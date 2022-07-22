const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
   "note",
   {
      note: {
         type: Sequelize.STRING,
      },
   },
   {
      timestamps: false,
   }
);
