import Note from "../models/Note.js";
import db from "../database/db.js";
import { get_date, log2db } from "../components/Logger.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

export const upd_entry = async (req, res) => {
   try {
      let data = await Note.db.truncate({ cascade: true });
      data = await Note.create({ data });

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         fileName,
         "upd_entry",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log("err:" + error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const fetch = async (req, res) => {
   try {
      const data = await db.query("SELECT * FROM notes");
      res.json({ status: 200, err: false, msg: "ok", data: data[0] });
   } catch (error) {
      log2db(
         500,
         fileName,
         "do_query",
         "catch.2",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log(error);
      res.json({ status: 200, err: true, msg: "", error });
   }
};
