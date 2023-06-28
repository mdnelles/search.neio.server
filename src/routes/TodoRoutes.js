import { dbmongo } from "../database/mongodb.js";
import { ObjectId } from "mongodb";
// import { Todo } from "../models/Todo.js";

export const get_todo = async (req, res) => {
   try {
      //const data = await Todo.findAll();
      const data = await dbmongo.collection("todos").find({}).toArray();

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log("----error fetching todos ------");
      console.log(error);
      res.json({ status: 200, err: true, msg: "error fetching todos", error });
   }
};

export const add_entry = async (req, res) => {
   const { title, details, due } = req.body;
   try {
      //let data = await Todo.create({ title, details, due });
      const data = await dbmongo
         .collection("todos")
         .insertOne({ title, details, due });

      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log("----error adding todos ------");
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const del_entry = async (req, res) => {
   try {
      //await Todo.destroy({ where: { id: req.body.id } }, { limit: 1 });
      const objectId = new ObjectId(_id);
      await dbmongo.collection("todos").deleteOne({ _id: objectId });
      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      console.log("----error deleting todos ------");
      console.log(error);
      json({ status: 200, err: true, msg: "error deleting todo", error });
   }
};

export const upd_entry = async (req, res) => {
   try {
      const { title = "", details = "", due = "", _id = 0 } = req.body;
      const objectId = new ObjectId(_id);
      await dbmongo
         .collection("todos")
         .updateOne({ _id: objectId }, { $set: { title, details, due } });

      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      console.log("----error updating todos ------");
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};
