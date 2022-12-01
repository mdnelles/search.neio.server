import { STRING } from "sequelize";
import { db } from "../database/db.js";

export const Note = db.sequelize.define(
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
