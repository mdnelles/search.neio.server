import { openai } from "../constants/api.js";
import { ChatLog } from "../models/ChatLogs.js";

export const chatWait = async (req, res) => {
   try {
      const { txt } = req.body;
      let completion = await openai.createChatCompletion({
         model: "gpt-3.5-turbo",
         messages: [{ role: "user", content: txt }],
      });
      let yourDate = new Date();

      const ttype = {
         prompt: txt,
         reply: completion.data.choices[0].message.content,
         date: yourDate.toISOString().split("T")[0],
      };
      console.log(ttype);
      const data = await ChatLog.create(ttype);
      console.log(completion.data.choices[0]);
      res.send(completion.data.choices[0]);
   } catch (err) {
      console.log(err);
      res.send("Error");
   }
};

export const getChatLogs = async (req, res) => {
   try {
      const data = await ChatLog.findAll();
      res.send(data);
   } catch (err) {
      console.log(err);
      res.send("Error");
   }
};
