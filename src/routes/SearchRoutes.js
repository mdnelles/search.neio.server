import { Router } from "express";
import { Search } from "../models/Search.js";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import { remove } from "fs-extra";
import path from "path";
import { ObjectId } from "mongodb";
// import { SearchTypes } from "../models/SearchTypes.js";
// import { QueryTypes } from "sequelize";

import { db } from "../database/db.js";
import { dbmongo } from "../database/mongodb.js";
import { get_date, log2db } from "../utils/Logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const search = Router();
search.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

const tdate = get_date();

export const add_entry = async (req, res) => {
   const { referer } = req.headers || "no refer";
   try {
      const { title, keywords, intro, code, __filename } = req.body;

      const image = __filename;

      var date1 = get_date();
      var date2 = Math.round(new Date().getTime() / 1000);
      var ttype = req.body.ttype;

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

      //const data = await Search.create(codeData);  // SQL
      const data = await dbmongo.collection("searches").insertOne(codeData);

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const add_cat = async (req, res) => {
   const ttype = req.body.category || "";
   try {
      //const data = await Search.create({ ttype });
      const data = dbmongo.collection("ttype").insertOne({ ttype });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log(error);
      res.json({ status: 200, err: false, msg: "ok" });
      console.log("Err Searchroutes.add_cat: " + error);
   }
};

export const get_ttypes = async (req, res) => {
   try {
      // const data = await SearchTypes.findAll({ attributes: ["ttype"],order: [["ttype", "ASC"]]});
      const data = await dbmongo.collection("search_types").find({}).toArray();

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log(error);
      res.json({ status: 200, err: true, msg: "", error });
   }
};

export const get_titles = async (req, res) => {
   try {
      // const data = await Search.findAll({attributes: ["id", "title", "date1", "code"],where: isDeleted: 0, }, order: [["date2", "DESC"]],});

      const data = await dbmongo
         .collection("searches")
         .find({ isDeleted: { $ne: true } })
         .toArray();
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      res.json({ err: true, msg: "error", error, status: 201 });
   }
};

export const del_one = async (req, res) => {
   try {
      const _id = req.body._id;
      const objectId = new ObjectId(_id);
      // await Search.update( { isDeleted: 1 },{ where: { id: req.body.id } },{ limit: 1 });
      const data = await dbmongo
         .collection("searches")
         .updateOne({ _id: objectId }, { $set: { isDeleted: true } });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log(error);
      res.json({ err: true, msg: "error", error, status: 201 });
   }
};

export const find_one = async (req, res) => {
   try {
      const _id = req.body._id;
      const objectId = new ObjectId(_id);

      const data = await dbmongo
         .collection("searches")
         .findOne({ _id: objectId });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log(error);
      res.json({ err: true, msg: "error", error, status: 201 });
   }
};

export const del_cat = async (req, res) => {
   try {
      const _id = req.body._id;
      const objectId = new ObjectId(_id);
      // const data = await Search.destroy({ where: { id: req.body.id } },{ limit: 1 });
      const data = await dbmongo
         .collection("search_types")
         .deleteOne({ _id: objectId });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log(error);
      res.json({ err: true, msg: "error", error, status: 201 });
   }
};

export const upd_one = async (req, res) => {
   try {
      const { title, code, _id } = req.body;
      const objectId = new ObjectId(_id);
      //const data = await Search.update({title,code, },{ where: { id } },{ limit: 1 });
      const data = await dbmongo
         .collection("searches")
         .updateOne({ _id: objectId }, { $set: { title, code } }, { limit: 1 });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log(error);
      res.json({ err: true, msg: "error", error, status: 201 });
   }
};

export const do_query = async (req, res) => {
   try {
      const query = await decodeURI(req.body.query).toString();
      const regexQuery = new RegExp(query, "i");
      const data = await Search.find({
         $and: [
            {
               $or: [{ title: regexQuery }, { code: regexQuery }],
            },
            { isDeleted: false },
         ],
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log("----error do_query serarchs ------");
      console.log(error);
      res.json({ status: 200, err: true, msg: "", error });
   }
};

export const removeFile = (req, res) => {
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
};

export const uploadfile = function (req, res) {
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
            console.log("----error uploading file ------");
            console.log(err);
            res.send("SearchRoutes.uploadfileUpload failed" + err).end();
         } else {
            console.log("Uploaded ok");
            res.end("File uploaded successfully");
         }
      });
   } else {
      console.log("Illegal file type");
      res.send("Illegal file type").end();
   }
};
