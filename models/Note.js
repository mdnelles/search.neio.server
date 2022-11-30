import { STRING } from "sequelize";
import { sequelize } from "../database/db.js";

export default sequelize.define(
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
