const express = require("express"),
   note = express.Router(),
   Note = require("../models/note"),
   Sequelize = require("sequelize"),
   db = require("../database/db"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");

let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

note.post("/upd_entry", rf.verifyToken, async (req, res) => {
   try {
      const { idnotepad } = req.body;
      let data = await Note.sequelize.truncate({ cascade: true });
      data = await Note.create({ note });

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
      res.json({ status: 201, err: true, msg: "", error, data });
   }
});

note.post("/fetch", rf.verifyToken, async (req, res) => {
   try {
      const data = await db.sequelize.query("SELECT * FROM notes");
      res.json({ status: 200, err: false, msg: "ok", data: data[0] });
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

module.exports = note;
