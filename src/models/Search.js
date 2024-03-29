import { INTEGER, STRING } from "sequelize";
import { db } from "../database/db.js";

export const Search = db.sequelize.define(
   "search",
   {
      id: {
         type: INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      ttype: {
         type: STRING,
      },
      title: {
         type: STRING,
      },
      keywords: {
         type: STRING,
      },
      intro: {
         type: STRING,
      },
      code: {
         type: STRING,
      },
      date1: {
         type: STRING,
      },
      date2: {
         type: STRING,
      },
      isDeleted: {
         type: INTEGER,
         defaultValue: 0,
      },
      image: {
         type: STRING,
      },
   },
   {
      timestamps: false,
   }
);
