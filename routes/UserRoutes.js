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

users.post("/register", (req, res) => {
   var today = new Date();
   const userData = {
      uuid: req.body.uuid,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today,
   };

   User.findOne({
      where: {
         email: req.body.email,
         isdeleted: 0,
      },
   })
      //TODO bcrypt
      .then((user) => {
         if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
               userData.password = hash;
               User.create(userData)
                  .then((user) => {
                     res.status(200)
                        .json({ status: user.email + "Registered!" })
                        .end();
                  })
                  .catch((err) => {
                     Logfn.log2db(
                        500,
                        fileName,
                        "register.1",
                        "catch",
                        err,
                        req,
                        req.headers.referer,
                        tdate
                     );
                     res.json({
                        error: "An error occurred please contact the admin",
                     }).end();
                     console.log("Err (catch) /UserRoutes/register: " + err);
                  });
            });
         } else {
            res.json({ error: "User already exists" }).end();
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "register.2",
            "catch",
            err,
            req,
            req.headers.referer,
            tdate
         );
         res.json({
            error: "An error occurred please contact the admin",
         }).end();
         console.log("Err #116: " + err);
      });
});

users.all("/login", (req, res) => {
   const { email = "na", password = "na" } = req.body;
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
      res.json({ token: token });
   } else {
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
      console.log({
         authFail: "email/password combination not found",
      });
      res.json({ authFail: "email/password combination not found" });
   }
});

users.get("/adminpanel", rf.verifyToken, (req, res) => {
   User.findOne({
      where: {
         id: decoded.id,
      },
   })
      .then((user) => {
         if (user) {
            res.json(user);
         } else {
            res.json({ error: "User does not exist" });
         }
      })
      .catch((err) => {
         res.json({ error: err });
      });
});

users.post("/remove_user", rf.verifyToken, (req, res) => {
   console.log("req.body.theUuid = " + JSON.stringify(req.body.theUuid));
   User.update(
      { isDeleted: 1 },
      { returning: true, where: { uuid: req.body.theUuid } }
   )
      .then((data) => {
         res.send(data).end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "remove_user",
            "catch",
            err,
            req,
            req.headers.referer,
            tdate
         );
         id;
         console.log("Client Error @ UserFunctions > remove_user" + err);
         res.status(404).send("Error Location 101").end();
      });
});

users.post("/getusers", rf.verifyToken, (req, res) => {
   User.findAll({
      where: {
         isDeleted: 0,
      },
   })
      .then((data) => {
         //console.log(data)
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "getusers",
            "catch",
            err,
            req,
            req.headers.referer,
            tdate
         );
         console.log("Client Error @ UserFunctions > get_users" + err);
         res.status(404).send("Error Location 102").end();
      });
});

users.post("/islogged", rf.verifyToken, (req, res) => {
   res.status(200).json(true).end();
});

module.exports = users;
