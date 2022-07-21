const express = require("express"),
   dbadmin = express.Router(),
   cors = require("cors"),
   shell = require("shelljs"),
   db = require("../database/db"),
   rf = require("./RoutFuctions");

dbadmin.use(cors());

dbadmin.post("/restorfromnew2", rf.verifyToken, (req, res) => {
   let DBname = req.body.DBname;
   let dump = `mysqldump -u ${process.env.NODE_DB_USER} -p${process.env.NODE_DB_PASS} ${DBname} > ./tmp/${DBname}.sql`;
   let copy = `mysql -u ${process.env.NODE_DB_USER} -p${process.env.NODE_DB_PASS} ${process.env.NODE_DB_NAME} < ./tmp/${DBname}.sql`;
   //dump = 'pwd'
   sh.exec(dump, (code, output) => {
      sh.exec(copy, (code, output) => {
         res.json({
            success:
               "restored (MainDB:" +
               process.env.NODE_DB_NAME +
               ") from " +
               DBname,
         }).end();
      });
   });
});

dbadmin.post("/restormain", rf.verifyToken, (req, res) => {
   let copy = `mysql -u ${process.env.NODE_DB_USER} -p${process.env.NODE_DB_PASS} ${process.env.NODE_DB_NAME} < ./tmp/${process.env.NODE_DB_NAME}_copy.sql`;
   sh.exec(copy, (code, output) => {
      res.json({
         success:
            "restored (MainDB:" + process.env.NODE_DB_NAME + ") from sql file",
      }).end();
   });
});

dbadmin.post("/copyfromdb2", rf.verifyToken, (req, res) => {
   let DBname = req.body.DBname;
   // following command works at command line but not in program
   var dump = `mysqldump --column-statistics=0 -h ${process.env.NODE_DB_HOST} -u ${process.env.NODE_DB_USER} -p${process.env.NODE_DB_PASS} ${process.env.NODE_DB_NAME} --set-gtid-purged=OFF | mysql -h ${process.env.NODE_DB_HOST} -u ${process.env.NODE_DB_USER} -p${process.env.NODE_DB_PASS}  ${DBname}  `;

   if (shell.exec(dump).code !== 0) {
      console.log(
         `ERR: ${process.env.NODE_DB_NAME} *FAILED* copied to-> ${DBname} `
      );
      res.send("fail");
   } else {
      console.log(`${process.env.NODE_DB_NAME} copied to-> ${DBname}`);
      res.send("success");
   }
});

dbadmin.post("/removedupes2", rf.verifyToken, (req, res) => {
   // establish that refering url is allowed
   var sql = `DELETE A
                    FROM  snowflake.donors A,
                          snowflake.donors B
                    WHERE  A.donorName = B.donorName AND  A.id > B.id`;
   db.sequelize
      .query(sql)
      .then((data) => {
         res.json({ success: data });
      })
      .catch((err) => {
         console.log("Client Error @ UserFunctions > get_donors" + err);
         res.status(404).send("Err #332 attempted to remove dupes").end();
      });
});

dbadmin.post("/createdb2", rf.verifyToken, (req, res) => {
   console.log("DbaRoutes > create db newDB-> " + req.body.newDbName);
   // establish that refering url is allowed
   if (req.body.newDbName !== undefined) {
      db.sequelize
         .query(
            `CREATE DATABASE IF NOT EXISTS ${
               process.env.NODE_DB_NAME + req.body.newDbName
            } `,
            {
               type: db.sequelize.QueryTypes.CREATE,
            }
         )
         .then(() => {
            res.json({ success: "Created DB: " + req.body.newDbName }).end();
         })
         .catch((err) => {
            console.log("++err #300 problem with query => " + err);
            res.json({ error: "failed to create new" }).end();
         });
   }
});

dbadmin.post("/showdbs2", rf.verifyToken, (req, res) => {
   db.sequelize
      .query("show databases")
      .then(function (rows) {
         if (rows !== undefined) {
            //console.log('LOC routes / DbaRoutes / showdbs rows = ' +JSON.stringify(rows));
            var temp = JSON.stringify(rows);
            var arrOfDbNames = temp.toString().split('"');
            var showDbs = [process.env.NODE_DB_NAME];
            arrOfDbNames.forEach((e, i) => {
               if (
                  e !== undefined &&
                  e.toString().includes(process.env.NODE_DB_NAME)
               ) {
                  //check to see if it is already pushed because getting dupes
                  var alreadyPushed = false;
                  showDbs.forEach((e2, i) => {
                     if (e === showDbs[i]) alreadyPushed = true;
                  });
                  if (alreadyPushed === false) showDbs.push(e);
               }
            });

            showDbs.shift();
            res.json(showDbs).end();
         } else {
            console.log("Had a problem with query SHOW DATABASES");
            res.json({
               error: "failed(1) to get databases DbaRoutes.js: " + err,
            }).end();
         }
      })
      .catch((err) => {
         console.log("error: " + err);
         res.json({
            error: "failed(2) to get databases DbaRoutes.js: " + err,
         }).end();
      });
});

dbadmin.post("/removedb2", rf.verifyToken, (req, res) => {
   db.sequelize
      .query("DROP SCHEMA IF EXISTS " + req.body.DBname)
      .then(() => {
         res.json({ success: "db removed" }).end();
      })
      .catch((err) => {
         res.json({ fail: "db remove failed:" }).end();
         console.log("failed to remove db: " + err);
      });
});

module.exports = dbadmin;
