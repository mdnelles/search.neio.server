const express = require("express"),
   logs = express.Router(),
   db = require("../database/db"),
   Sequelize = require("sequelize"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");

let ip = "0.0.0.0";
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

logs.post("/get_logs", rf.verifyToken, (req, res) => {
   const { code = 500, perPage = 20, page } = req.body;

   const offset = !!page && !isNaN(page) ? page * perPage - perPage : 0;

   db.sequelize
      .query(
         "SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC limit :perPage OFFSET :offset",
         {
            replacements: {
               code,
               perPage,
               offset,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "get_logs",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log("Client Error @ UserFunctions > get_logs" + err);
         res.status(404).send("Error Location 102").end();
      });
});

logs.post("/get_logcount", rf.verifyToken, (req, res) => {
   let code = 500;
   if (req.body.code !== undefined) code = req.body.code;

   db.sequelize
      .query("SELECT count(*) FROM logs WHERE code = :code ", {
         replacements: {
            code: code,
         },
         type: Sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
         data = JSON.stringify(data);
         let temp1 = data.split(":");
         let temp2 = temp1[1].split("}");
         let num = temp2[0];
         res.send(num);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "get_count (logs)",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log("Server @ LogRoutes.get_count" + err);
         res.status(200).send("Error LogRoutes.get_count").end();
      });
});

module.exports = logs;
