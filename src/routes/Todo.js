import * as db from "../models/todo.js";
import * as dbc from "../database/db.js";
import { get_date, log2db } from "../components/Logger.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let tdate = get_date();

export const add_entry = async (req, res) => {
   const { title, details, due } = req.body;
   const { referer } = req.headers;
   try {
      let data = await db.create({ title, details, due });

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename,
         "add_entry.2",
         "todoroutes.add_entry",
         error,
         req,
         referer,
         tdate
      );
      res.json({ status: 201, err: true, msg: "" });
      console.log("Err todoroutes.add_entry: " + error);
   }
};

export const del_entry = async (req, res) => {
   try {
      await db.destroy({ where: { id: req.body.id } }, { limit: 1 });
      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      log2db(
         500,
         __filename,
         "del_entry",
         "no data to send",
         error,
         req,
         req.headers.referer,
         tdate
      );
      res.json({ status: 200, err: true, msg: "", error });
   }
};

export const upd_entry = async (req, res) => {
   try {
      const { title = "", details = "", due = "", id = 0 } = req.body;
      await db.update(
         {
            title,
            details,
            due,
         },
         { where: { id } },
         { limit: 1 }
      );

      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      log2db(
         500,
         __filename,
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

export const get_todo = async (req, res) => {
   try {
      const data = await dbc.query("SELECT * FROM todos ");
      res.json({ status: 200, err: false, msg: "ok", data: data[0] });
   } catch (error) {
      log2db(
         500,
         __filename,
         "do_query",
         "catch.2",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log("err:" + error);
      res.json({ status: 200, err: true, msg: "", error });
   }
};
