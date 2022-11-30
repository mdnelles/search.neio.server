import { Router } from "express";
import { sequelize } from "../database/db";
import { QueryTypes } from "sequelize";
import { get_date, log2db } from "../components/Logger";
import { verifyToken } from "./RoutFuctions";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const logs = Router();
let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

logs.post("/get_logs", verifyToken, async (req, res) => {
   try {
      const { code = 500, perPage = 20, page } = req.body;

      const offset = !!page && !isNaN(page) ? page * perPage - perPage : 0;

      const data = sequelize.query(
         "SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC limit :perPage OFFSET :offset",
         {
            replacements: {
               code,
               perPage,
               offset,
            },
            type: QueryTypes.SELECT,
         }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         fileName,
         "get_logs",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log(error);
      res.json({ status: 200, err: false, msg: "error" });
   }
});

logs.post("/get_logcount", verifyToken, (req, res) => {
   try {
      const { code = 500 } = req.params;

      const data = sequelize.query(
         "SELECT count(*) FROM logs WHERE code = :code ",
         {
            replacements: {
               code: code,
            },
            type: QueryTypes.SELECT,
         }
      );

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         fileName,
         "get_count (logs)",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log(error);
      res.json({ status: 200, err: true, msg: "", error });
   }
});

export default logs;
