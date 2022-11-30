import { INTEGER, STRING, DATE, NOW } from "sequelize";
import { sequelize } from "../database/db.js";

export default sequelize.define(
   "session",
   {
      id: {
         type: INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      user_id: {
         type: STRING,
      },
      session_key: {
         type: STRING,
      },
      created: {
         type: DATE,
         defaultValue: NOW,
      },
   },
   {
      timestamps: false,
   }
);
