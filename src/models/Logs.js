import { INTEGER, STRING } from "sequelize";
import db from "../database/db.js";

export default db.sequelize.define(
   "log",
   {
      id: {
         type: INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      filename: {
         type: STRING,
      },
      code: {
         type: STRING,
      },
      fnction: {
         type: STRING,
      },
      msg_programmer: {
         type: STRING,
      },
      msg_app: {
         type: STRING,
      },
      ip: {
         type: STRING,
      },
      refer: {
         type: STRING,
      },
      tdate: {
         type: STRING,
      },
   },
   {
      timestamps: false,
   }
);
