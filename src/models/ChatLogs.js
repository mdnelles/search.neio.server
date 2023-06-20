import { INTEGER, STRING } from "sequelize";
import { db } from "../database/db.js";

export const ChatLog = db.sequelize.define(
   "chatlog",
   {
      id: {
         type: INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      prompt: {
         type: STRING,
      },
      reply: {
         type: STRING,
      },
      date: {
         type: STRING,
      },
   },
   {
      timestamps: false,
   }
);
