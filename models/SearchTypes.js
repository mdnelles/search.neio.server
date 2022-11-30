import { INTEGER, STRING } from "sequelize";
import { sequelize } from "../database/db.js";

export default sequelize.define(
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
