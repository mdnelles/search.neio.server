import { STRING } from "sequelize";
import db from "../database/db.js";

export default db.sequelize.define(
   "note",
   {
      note: {
         type: STRING,
      },
   },
   {
      timestamps: false,
   }
);
