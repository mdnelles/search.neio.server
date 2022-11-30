import { Router } from "express";
import Note from "../models/Note";
import { sequelize } from "../database/db";
import { get_date, log2db } from "../components/Logger";
import { verifyToken } from "./RoutFuctions";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const note = Router();
let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

note.post("/upd_entry", verifyToken, async (req, res) => {
   try {
      let data = await Note.sequelize.truncate({ cascade: true });
      data = await Note.create({ note });

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
});

note.post("/fetch", verifyToken, async (req, res) => {
   try {
      const data = await sequelize.query("SELECT * FROM notes");
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
});

export default note;
