import { Router } from "express";
import cors from "cors";
import { exec } from "shelljs";
import { sequelize } from "../database/db";
import { verifyToken } from "./RoutFuctions";
import * as dotenv from "dotenv";
const env = dotenv.config();

const dbadmin = Router();
dbadmin.use(cors());

dbadmin.post("/restorfromnew2", verifyToken, (req, res) => {
   const { DBname = "" } = req.body;
   let dump = `mysqldump -u ${env.NODE_DB_USER} -p${env.NODE_DB_PASS} ${DBname} > ./tmp/${DBname}.sql`;
   let copy = `mysql -u ${env.NODE_DB_USER} -p${env.NODE_DB_PASS} ${env.NODE_DB_NAME} < ./tmp/${DBname}.sql`;

   exec(dump, () => {
      exec(copy, () => {
         res.json({
            msg: "restored (MainDB:" + env.NODE_DB_NAME + ") from " + DBname,
            err: false,
            status: 200,
         });
      });
   });
});

dbadmin.post("/restormain", verifyToken, (req, res) => {
   let copy = `mysql -u ${env.NODE_DB_USER} -p${env.NODE_DB_PASS} ${env.NODE_DB_NAME} < ./tmp/${env.NODE_DB_NAME}_copy.sql`;
   exec(copy, () => {
      res.json({
         status: 201,
         msg: "restored (MainDB:" + env.NODE_DB_NAME + ") from sql file",
         err: false,
      });
   });
});

dbadmin.post("/copyfromdb2", verifyToken, (req, res) => {
   let DBname = req.body.DBname;
   // following command works at command line but not in program
   var dump = `mysqldump --column-statistics=0 -h ${env.NODE_DB_HOST} -u ${env.NODE_DB_USER} -p${env.NODE_DB_PASS} ${env.NODE_DB_NAME} --set-gtid-purged=OFF | mysql -h ${env.NODE_DB_HOST} -u ${env.NODE_DB_USER} -p${env.NODE_DB_PASS}  ${DBname}  `;

   if (exec(dump).code !== 0) {
      console.log(`ERR: ${env.NODE_DB_NAME} *FAILED* copied to-> ${DBname} `);
      res.send("fail");
   } else {
      console.log(`${env.NODE_DB_NAME} copied to-> ${DBname}`);
      res.send("success");
   }
});

dbadmin.post("/removedupes2", verifyToken, (req, res) => {
   // establish that refering url is allowed
   var sql = `DELETE A
                    FROM  snowflake.donors A,
                          snowflake.donors B
                    WHERE  A.donorName = B.donorName AND  A.id > B.id`;
   sequelize
      .query(sql)
      .then((data) => {
         res.json({ success: data });
      })
      .catch((err) => {
         console.log("Client Error @ UserFunctions > get_donors" + err);
         res.status(404).send("Err #332 attempted to remove dupes").end();
      });
});

dbadmin.post("/createdb2", verifyToken, (req, res) => {
   console.log("DbaRoutes > create db newDB-> " + req.body.newDbName);
   // establish that refering url is allowed
   if (req.body.newDbName !== undefined) {
      sequelize
         .query(
            `CREATE DATABASE IF NOT EXISTS ${
               env.NODE_DB_NAME + req.body.newDbName
            } `,
            {
               type: sequelize.QueryTypes.CREATE,
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

dbadmin.post("/showdbs2", verifyToken, async (req, res) => {
   try {
      const rows = await sequelize.query(" SHOW DATABASES ");
      const temp = JSON.stringify(rows);
      const arrOfDbNames = temp.toString().split('"');
      const showDbs = [env.NODE_DB_NAME];
      arrOfDbNames.forEach((e) => {
         if (e !== undefined && e.toString().includes(env.NODE_DB_NAME)) {
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
   } catch (error) {
      console.log("Had a problem with query SHOW DATABASES");
      res.json({ status: 201, msg: "error", err: true, error });
   }
});

dbadmin.post("/removedb2", verifyToken, (req, res) => {
   sequelize
      .query("DROP SCHEMA IF EXISTS " + req.body.DBname)
      .then(() => {
         res.json({ success: "db removed" }).end();
      })
      .catch((err) => {
         res.json({ fail: "db remove failed:" }).end();
         console.log("failed to remove db: " + err);
      });
});

export default dbadmin;
