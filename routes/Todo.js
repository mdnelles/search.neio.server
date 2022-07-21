const express = require("express"),
   todo = express.Router(),
   Todo = require("../models/todo"),
   Sequelize = require("sequelize"),
   db = require("../database/db"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");

let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

todo.post("/add_entry", rf.verifyToken, async (req, res) => {
   const { title, details, due } = req.body;
   const { referer } = req.headers;
   try {
      let data = await Todo.create({ title, details, due });

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
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
});

todo.post("/del_entry", rf.verifyToken, async (req, res) => {
   try {
      await Todo.destroy({ where: { id: req.body.id } }, { limit: 1 });
      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "del_entry",
         "no data to send",
         error,
         req,
         req.headers.referer,
         tdate
      );
      res.json({ status: 200, err: true, msg: "", error });
   }
});

todo.post("/upd_entry", rf.verifyToken, async (req, res) => {
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
      Logfn.log2db(
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

todo.post("/fetch", rf.verifyToken, async (req, res) => {
   try {
      const data = await db.sequelize.query("SELECT * FROM todos ");
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "do_query",
         "catch.2",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log("err:" + err);
      res.json({ status: 200, err: true, msg: "", error });
   }
});

module.exports = todo;
