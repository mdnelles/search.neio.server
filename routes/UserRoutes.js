const express = require("express"),
   users = express.Router(),
   jwt = require("jsonwebtoken"),
   bcrypt = require("bcrypt"),
   User = require("../models/User"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");

let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();
const { NODE_ADMIN_EMAIL, NODE_ADMIN_PASSWORD, NODE_DB_HOST } = process.env;

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

      let user = await User.findOne({
         where: {
            email: req.body.email,
            isdeleted: 0,
         },
      });

      if (!user) {
         bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash;
         });
         data = await User.create(userData);
         res.json({ status: 200, err: false, msg: "ok", data });
      } else {
         res.json({
            status: 202,
            err: false,
            msg: "user account already exists",
            data,
         });
      }
   } catch (error) {
      Logfn.log2db(
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
   console.log(req.body);
   const { email = "na", password = "na" } = req.body;
   console.log("--email: " + email);
   console.log("--password: " + password);
   if (
      (email === NODE_ADMIN_EMAIL ||
         email === `${NODE_ADMIN_EMAIL}@gmail.com`) &&
      password === NODE_ADMIN_PASSWORD
   ) {
      // successful login
      let token = jwt.sign(
         { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10000, data: email },
         process.env.NODE_SECRET
      );
      console.log("token issued: " + token);
      res.json({ status: 200, err: false, msg: "ok", token });
   } else {
      console.log({
         authFail: "email/password combination not found",
      });

      res.json({ status: 201, err: true, msg: "login failed" });
      Logfn.log2db(
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

users.get("/adminpanel", rf.verifyToken, async (req, res) => {
   try {
      const { id } = req.body;
      const user = await User.findOne({ where: { id } });
      let msg = "User does not exist";
      if (!!user) msg = "user found";
      res.json({ status: 200, err: false, msg, data: user });
   } catch (error) {
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/remove_user", rf.verifyToken, async (req, res) => {
   try {
      const data = await User.update(
         { isDeleted: 1 },
         { returning: true, where: { uuid: req.body.theUuid } }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "remove_user",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      id;
      console.log("Client Error @ UserFunctions > remove_user" + error);
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/getusers", rf.verifyToken, async (req, res) => {
   try {
      const data = await User.findAll({
         where: {
            isDeleted: 0,
         },
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
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

users.post("/islogged", rf.verifyToken, (req, res) => {
   res.status(200).json(true).end();
});

module.exports = users;
