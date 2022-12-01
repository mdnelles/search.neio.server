import { INTEGER, STRING } from "sequelize";
import db from "../database/db.js";

export default db.sequelize.define(
   "search_types",
   {
      id: {
         type: INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      ttype: {
         type: STRING,
      },
   },
   {
      timestamps: false,
   }
);
