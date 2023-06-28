import { Router } from "express";
import { Search } from "../models/Search.js";

import { db } from "../database/db.js";
import { mongodb } from "../database/mongodb.js";

export const convertSQLToMongo = async (_, res) => {
   // first list out the tables in the "search" database
   let tables = await db.query("SHOW TABLES", { type: db.QueryTypes.SELECT });
   console.log(tables);

   res.json({ status: 200, err: false, msg: "ok", data: tables });
};
