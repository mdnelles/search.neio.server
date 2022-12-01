import jwt from "jsonwebtoken";
import { log2db } from "../components/Logger.js";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
const env = dotenv.config().parsed;
const __filename = fileURLToPath(import.meta.url);

const get_date = () => {
   let d = new Date();
   let month = parseInt(d.getMonth());
   month += 1;
   let tdate =
      d.getDate() +
      "-" +
      month +
      "-" +
      d.getFullYear() +
      " - " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      " " +
      d.getSeconds();
   return tdate;
};

let ip = "0.0.0.0";
let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

const tokenTest = (token, res, jwt, caller, next) => {
   try {
      jwt.verify(token, env.NODE_SECRET, (error) => {
         if (error) {
            console.log("bad token:" + token);
            res.json({
               err: true,
               status: 201,
               msg: "login again to obtain new token",
               error,
            });
         } else {
            log2db(
               200,
               fileName,
               "Token Test",
               "Token accepted",
               "",
               ip,
               caller,
               tdate
            );
            console.log("token ok caller -> " + caller);
            next(); // Next middleware
         }
      });
   } catch (error) {
      console.log("bad token:" + token);
      res.json({
         err: true,
         status: 201,
         msg: "login again to obtain new token",
         error,
      });
   }
};

export function verifyToken(req, res, next) {
   const token = req.body.token || req.headers.token || "";
   const caller = req.body.caller || "NA";

   try {
      tokenTest(req.headers.token, res, jwt, caller, next);
   } catch (error) {
      console.log("token fail" + caller + "token fail=" + token);
      console.log(error);
      res.sendStatus(403);
   }
}
