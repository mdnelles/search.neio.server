import { Router } from "express";
import Search from "../models/Search";
import { create, findAll, destroy } from "../models/SearchTypes";
import { QueryTypes } from "sequelize";
import { sequelize } from "../database/db";
import fileUpload from "express-fileupload";
import { remove } from "fs-extra";
import { get_date, log2db } from "../components/Logger";
import { verifyToken } from "./RoutFuctions";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const search = Router();
search.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

const tdate = get_date();

search.post("/add_entry", verifyToken, async (req, res) => {
   const { referer } = req.headers || "no refer";
   try {
      //const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
      const { title, keywords, intro, code, __filename } = req.body;

      var date1 = get_date();
      var date2 = Math.round(new Date().getTime() / 1000);
      var ttype = req.body.ttype;

      var image = __filename;

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
      log2db(
         500,
         __filename,
         "add_entry.2",
         "Searchroutes.add_entry",
         error,
         req,
         referer,
         tdate
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
});

search.post("/add_cat", verifyToken, async (req, res) => {
   const ttype = req.body.category || "";
   try {
      const data = await create({ ttype });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename,
         "add_cat",
         error,
         "",
         req,
         req.headers.referer,
         tdate
      );
      res.json({ status: 200, err: false, msg: "ok" });
      console.log("Err Searchroutes.add_cat: " + error);
   }
});

search.post("/get_ttypes", verifyToken, async (req, res) => {
   try {
      const data = await findAll({
         attributes: ["id", "ttype"],
         order: [["ttype", "ASC"]],
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename,
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

search.post("/get_titles", verifyToken, async (req, res) => {
   try {
      const data = await Search.findAll({
         attributes: ["id", "title", "date1", "code"],
         where: {
            isDeleted: 0,
         },
         order: [["date2", "DESC"]],
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename,
         "get_ttype",
         "no data to send",
         "",
         req,
         req.headers.referer,
         tdate``
      );
      res.json({ error: err });
   }
});

search.post("/del_entry", verifyToken, async (req, res) => {
   try {
      await Search.update(
         { isDeleted: 1 },
         { where: { id: req.body.id } },
         { limit: 1 }
      );
      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      log2db(
         500,
         __filename,
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

search.post("/del_cat", verifyToken, async (req, res) => {
   try {
      await destroy({ where: { id: req.body.id } }, { limit: 1 });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename,
         "del_cat",
         "catch",
         error,
         req,
         req.headers.referer,
         tdate
      );
      console.log("err: SearchRoutes.del_cat: " + error);
      res.json({ error });
   }
});

search.post("/upd_entry", verifyToken, async (req, res) => {
   const { title, code, id } = req.body;
   try {
      const data = await Search.update(
         {
            title,
            code,
         },
         { where: { id } },
         { limit: 1 }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename,
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

search.post("/do_query", verifyToken, async (req, res) => {
   try {
      let query = decodeURI(req.body.query).toString(),
         data = "no data";
      const data1 = await sequelize.query(
         "SELECT * FROM searches WHERE ( title LIKE :query AND isDeleted = 0 )",
         {
            replacements: {
               query: `%${query}%`,
            },
            type: QueryTypes.SELECT,
         }
      );

      const data2 = await sequelize.query(
         "SELECT * FROM searches WHERE code LIKE :query AND isDeleted = 0 AND !(title LIKE :query) ",
         {
            replacements: {
               query: `%${query}%`,
            },
            type: QueryTypes.SELECT,
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
      log2db(
         500,
         __filename,
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

search.post("/removeFile", verifyToken, (req, res) => {
   console.log("in removeFile");
   const path = "../client/public/upload/";
   const __filename = req.body.__filename;

   // With Promises:
   remove("./tmp/myfile");
   remove(path + __filename)
      .then(() => {
         console.log("success delete file: " + __filename);
         res.send("ok").end();
      })
      .catch((err) => {
         log2db(
            500,
            __filename,
            "removeFile",
            "catch",
            err,
            req,
            req.headers.referer,
            tdate
         );
         console.error(
            "Failed in deleting file " + __filename + " Err: " + err
         );
         res.send("failed to delete file").end();
      });
});

search.post("/uploadfile", verifyToken, function (req, res) {
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
            log2db(
               500,
               __filename,
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
      log2db(
         500,
         __filename,
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

export default search;
