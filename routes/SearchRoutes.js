const express = require("express"),
   search = express.Router(),
   Search = require("../models/Search"),
   SearchTypes = require("../models/SearchTypes"),
   Sequelize = require("sequelize"),
   db = require("../database/db"),
   fileUpload = require("express-fileupload"),
   fs = require("fs-extra"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");

search.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

search.post("/add_entry", rf.verifyToken, async (req, res) => {
   try {
      ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
      const { title, keywords, intro, code, fileName } = req.body;
      const { referer } = req.headers;
      var date1 = Logfn.get_date();
      var date2 = Math.round(new Date().getTime() / 1000);
      var ttype = req.body.ttype;

      var image = fileName;

      let codeData = {
         ttype,
         title,
         keywords,
         intro,
         code,
         date1,
         date2,
         image,
      };

      const data = await Search.create(codeData);

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "add_entry.2",
         "Searchroutes.add_entry",
         error,
         req,
         referer,
         tdate
      );
      res.json({ status: 201, err: true, msg: "", error });
      console.log("Err Searchroutes.add_entry: " + err);
   }
});

search.post("/add_cat", rf.verifyToken, async (req, res) => {
   try {
      ttype = req.body.category;

      const data = await SearchTypes.create({ ttype });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "add_cat",
         error,
         "",
         req,
         req.headers.referer,
         tdate
      );
      res.json({ status: 200, err: false, msg: "ok", data });
      console.log("Err Searchroutes.add_cat: " + err);
   }
});

search.post("/get_ttypes", rf.verifyToken, async (req, res) => {
   try {
      const data = await SearchTypes.findAll({
         attributes: ["id", "ttype"],
         order: [["ttype", "ASC"]],
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "get_types",
         "catch err",
         error,
         req,
         req.headers.referer,
         tdate
      );
      res.json({ status: 200, err: true, msg: "", error });
   }
});

search.post("/get_titles", rf.verifyToken, async (req, res) => {
   try {
      const data = Search.findAll({
         attributes: ["id", "title"],
         where: {
            isDeleted: 0,
         },
         order: [["title", "ASC"]],
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "get_ttype",
         "no data to send",
         "",
         req,
         req.headers.referer,
         tdate
      );
      res.json({ error: err });
   }
});

search.post("/del_entry", rf.verifyToken, async (req, res) => {
   try {
      await Search.update(
         { isDeleted: 1 },
         { where: { id: req.body.id } },
         { limit: 1 }
      );
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
      console.log("err: SearchRoutes.del_entry: " + err);
      res.json({ error: err });
   }
});

search.post("/del_cat", rf.verifyToken, async (req, res) => {
   try {
      await SearchTypes.destroy({ where: { id: req.body.id } }, { limit: 1 });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileName,
         "del_cat",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log("err: SearchRoutes.del_cat: " + err);
      res.json({ error: err });
   }
});

search.post("/upd_entry", rf.verifyToken, async (req, res) => {
   try {
      const data = await Search.update(
         {
            title: req.body.title,
            code: req.body.code,
            intro: req.body.intro,
         },
         { where: { id: req.body.id } },
         { limit: 1 }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
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
      console.log("err:" + err);
      res.json({ error: err });
   }
});

search.post("/do_query", rf.verifyToken, async (req, res) => {
   try {
      let query = decodeURI(req.body.query).toString(),
         data = "no data";
      const data1 = await db.sequelize.query(
         "SELECT * FROM searches WHERE ( title LIKE :query AND isDeleted = 0 )",
         {
            replacements: {
               query: `%${query}%`,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      const data2 = await db.sequelize.query(
         "SELECT * FROM searches WHERE code LIKE :query AND isDeleted = 0 AND !(title LIKE :query) ",
         {
            replacements: {
               query: `%${query}%`,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      if (!!data1 && !!data2) {
         data = data1.concat(data2);
      } else if (!!data1) {
         data = data1;
      } else if (!!data2) {
         data = data2;
      }
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
      console.log("err:" + error);
      res.json({ status: 200, err: true, msg: "", error });
   }
});

search.post("/removeFile", rf.verifyToken, (req, res) => {
   console.log("in removeFile");
   const path = "../client/public/upload/";
   const fileName = req.body.fileName;

   // With Promises:
   fs.remove("./tmp/myfile");
   fs.remove(path + fileName)
      .then(() => {
         console.log("success delete file: " + fileName);
         res.send("ok").end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "removeFile",
            "catch",
            err,
            req,
            req.headers.referer,
            tdate
         );
         console.error("Failed in deleting file " + fileName + " Err: " + err);
         res.send("failed to delete file").end();
      });
});

search.post("/uploadfile", rf.verifyToken, function (req, res) {
   var mime = req.files.files.mimetype.toString();
   let pathToUpload = __dirname
      .toString()
      .replace("/server/routes", "/client/build/upload/")
      .replace("//", "/");
   console.log("In upload file path = " + pathToUpload);

   //if(fn.includes(".php") || fn.includes(".js") ||  fn.includes(".pl") || fn.includes(".htm")|| fn.includes(".exe") || fn.includes(".txt") || !fn.includes(".")){
   if (
      mime.includes("image") ||
      mime.includes("audio") ||
      mime.includes("video")
   ) {
      req.files.files.mv(pathToUpload + req.files.files.name, function (err) {
         if (err) {
            Logfn.log2db(
               500,
               fileName,
               "uploadfile",
               "fail during upload",
               err,
               req,
               req.headers.referer,
               tdate
            );
            console.log("Error: " + err);
            res.send("SearchRoutes.uploadfileUpload failed" + err).end();
         } else {
            console.log("Uploaded ok");
            res.end("File uploaded successfully");
         }
      });
   } else {
      Logfn.log2db(
         500,
         fileName,
         "uploadfile",
         "Illegal file type",
         "",
         req,
         req.headers.referer,
         tdate
      );
      console.log("Illegal file type");
      res.send("Illegal file type").end();
   }
});

module.exports = search;
