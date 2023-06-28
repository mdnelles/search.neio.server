import { Router } from "express";
import { Search } from "../models/Search.js";

import { db } from "../database/db.js";
import { dbmongo } from "../database/mongodb.js";

export const convertSQLToMongo = async (_, res) => {
   try {
      // first list out the tables in the "search" database
      let tables = await db.sequelize.query("SHOW TABLES");
      //console.log(tables[0]);

      for (const table of tables[0]) {
         const tableName = table.Tables_in_search;
         console.log(tableName);

         const tmp = await db.sequelize.query(`SELECT * FROM ${tableName} `, {
            type: db.sequelize.QueryTypes.SELECT,
         });

         tmp.map(async (item) => {
            await dbmongo.collection(tableName).insertOne(item);
         });
      }

      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      console.log(error);
      res.json({ status: 200, err: true, msg: "", error });
   }
};
