import { STRING } from "sequelize";
import { db } from "../database/db.js";

export const Notes = db.sequelize.define(
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
