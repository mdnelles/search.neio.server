import { INTEGER, STRING, DATE } from "sequelize";
import { sequelize } from "../database/db.js";

export default sequelize.define(
   "todo",
   {
      id: {
         type: INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      title: {
         type: STRING,
      },
      details: {
         type: STRING,
      },
      due: {
         type: STRING,
      },
      createAt: {
         type: DATE,
      },
      updatedAt: {
         type: DATE,
      },
   },
   {
      timestamps: true,
   }
);
