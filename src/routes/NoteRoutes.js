import { Todo } from "../models/Todo.js";

export const fetch = async (req, res) => {
   try {
      const data = await Todo.findOne();
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      console.log("----error fetching Note ------");
      console.log(error);
      res.json({ status: 200, err: true, msg: "error fetching todos", error });
   }
};

export const upd_entry = async (req, res) => {
   try {
      // dummy message
      res.json({ status: 200, err: false, msg: "ok" });
   } catch (error) {
      console.log("----error updating Note ------");
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};
