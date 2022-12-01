import { INTEGER, STRING, DATE, NOW } from "sequelize";
import db from "../database/db.js";

export default db.sequelize.define(
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
