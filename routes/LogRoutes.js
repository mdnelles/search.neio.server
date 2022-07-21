const express = require("express"),
   logs = express.Router(),
   db = require("../database/db"),
   Sequelize = require("sequelize"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");

let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

logs.post("/get_logs", rf.verifyToken, async (req, res) => {
   try {
      const { code = 500, perPage = 20, page } = req.body;

      const offset = !!page && !isNaN(page) ? page * perPage - perPage : 0;

      const data = db.sequelize.query(
         "SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC limit :perPage OFFSET :offset",
         {
            replacements: {
               code,
               perPage,
               offset,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "get_logs",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log("Client Error @ UserFunctions > get_logs" + error);
      res.json({ status: 200, err: false, msg: "ok", data });
   }
});

logs.post("/get_logcount", rf.verifyToken, (req, res) => {
   try {
      const { code = 500 } = params;

      const data = db.sequelize.query(
         "SELECT count(*) FROM logs WHERE code = :code ",
         {
            replacements: {
               code: code,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "get_count (logs)",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log("Server @ LogRoutes.get_count" + err);
      res.json({ status: 200, err: true, msg: "", error });
   }
});

module.exports = logs;
