import { Router } from "express";

import { sign } from "jsonwebtoken";
import { hash as _hash } from "bcrypt";
import { findOne, create, update, findAll } from "../models/User";
import { get_date, log2db } from "../components/Logger";
import { verifyToken } from "./RoutFuctions";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
const { NODE_ADMIN_EMAIL, NODE_ADMIN_PASSWORD, NODE_SECRET } = dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const users = Router();

let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

users.post("/register", async (req, res) => {
   try {
      var today = new Date();
      const userData = {
         uuid: req.body.uuid,
         first_name: req.body.first_name,
         last_name: req.body.last_name,
         email: req.body.email,
         password: req.body.password,
         created: today,
      };

      let user = await findOne({
         where: {
            email: req.body.email,
            isdeleted: 0,
         },
      });

      if (!user) {
         _hash(req.body.password, 10, (err, hash) => {
            userData.password = hash;
         });
         const data = await create(userData);
         res.json({ status: 200, err: false, msg: "ok", data });
      } else {
         res.json({
            status: 202,
            err: false,
            msg: "user account already exists",
         });
      }
   } catch (error) {
      log2db(
         500,
         fileName,
         "register.2",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      res.json({ status: 200, err: true, msg: "", error });
      console.log(error);
   }
});

users.all("/login", (req, res) => {
   const { email = "na", password = "na" } = req.body;

   if (
      (email === NODE_ADMIN_EMAIL ||
         email === `${NODE_ADMIN_EMAIL}@gmail.com`) &&
      password === NODE_ADMIN_PASSWORD
   ) {
      // successful login
      let token = sign(
         { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10000, data: email },
         NODE_SECRET
      );
      console.log("token issued: " + token);
      res.json({ status: 200, err: false, msg: "ok", token });
   } else {
      console.log({
         authFail: "email/password combination not found",
      });

      res.json({ status: 201, err: true, msg: "login failed" });
      log2db(
         500,
         fileName,
         "login password failed",
         req.body.email,
         "error",
         req,
         req.headers.referer,
         tdate
      );
   }
});

users.get("/adminpanel", verifyToken, async (req, res) => {
   try {
      const { id } = req.body;
      const user = await findOne({ where: { id } });
      let msg = "User does not exist";
      if (user) msg = "user found";
      res.json({ status: 200, err: false, msg, data: user });
   } catch (error) {
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/remove_user", verifyToken, async (req, res) => {
   try {
      const data = await update(
         { isDeleted: 1 },
         { returning: true, where: { uuid: req.body.theUuid } }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         fileName,
         "remove_user",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );

      console.log("Client Error @ UserFunctions > remove_user" + error);
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/getusers", verifyToken, async (req, res) => {
   try {
      const data = await findAll({
         where: {
            isDeleted: 0,
         },
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         fileName,
         "getusers",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/islogged", verifyToken, (req, res) => {
   res.status(200).json(true).end();
});

export default users;
