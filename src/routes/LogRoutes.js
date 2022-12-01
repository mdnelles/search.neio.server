import db from "../database/db.js";
import { QueryTypes } from "sequelize";
import { get_date, log2db } from "../components/Logger.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

export const get_logs = async (req, res) => {
   try {
      const { code = 500, perPage = 20, page } = req.body;

      const offset = !!page && !isNaN(page) ? page * perPage - perPage : 0;

      const data = db.query(
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
};

export const get_logcount = (req, res) => {
   try {
      const { code = 500 } = req.params;

      const data = db.query("SELECT count(*) FROM logs WHERE code = :code ", {
         replacements: {
            code: code,
         },
         type: QueryTypes.SELECT,
      });

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
};
