import { INTEGER, STRING, DATE, NOW } from "sequelize";
import { sequelize } from "../database/db.js";

export default sequelize.define(
   "user",
   {
      id: {
         type: INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      email: {
         type: STRING,
      },
      password: {
         type: STRING,
      },
      first_name: {
         type: STRING,
      },
      last_name: {
         type: STRING,
      },
      admin: {
         type: INTEGER,
      },
      last_login: {
         type: DATE,
         defaultValue: NOW,
      },
      isDeleted: {
         type: INTEGER,
         defaultValue: 0,
      },
      uuid: {
         type: STRING,
      },
   },
   {
      timestamps: false,
   }
);
