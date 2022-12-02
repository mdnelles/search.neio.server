import { Todo } from "../models/Todo.js";
//import { db } from "../database/db.js";
import { get_date, log2db } from "../utils/Logger.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let tdate = get_date();

export const add_entry = async (req, res) => {
   const { title, details, due } = req.body;
   const { referer } = req.headers;
   try {
      let data = await Todo.create({ title, details, due });

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log("----error adding todos ------");
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const del_entry = async (req, res) => {
   try {
      await Todo.destroy({ where: { id: req.body.id } }, { limit: 1 });
      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      console.log("----error deleting todos ------");
      console.log(error);
      json({ status: 200, err: true, msg: "error deleting todo", error });
   }
};

export const upd_entry = async (req, res) => {
   try {
      const { title = "", details = "", due = "", id = 0 } = req.body;
      await Todo.update(
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
      console.log("----error updating todos ------");
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const get_todo = async (req, res) => {
   try {
      //const data = await db.query("SELECT * FROM todos ");
      const data = await Todo.findAll();
      res.json({ status: 200, err: false, msg: "ok", data: data[0] });
   } catch (error) {
      console.log("----error fetching todos ------");
      console.log(error);
      res.json({ status: 200, err: true, msg: "error fetching todos", error });
   }
};
