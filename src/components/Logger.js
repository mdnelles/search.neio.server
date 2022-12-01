import * as log from "../models/Logs.js";

export const log2db = (
   code,
   filename,
   fnction,
   msg_programmer,
   msg_app,
   req,
   refer,
   tdate
) => {
   const ip =
      !!req && (!!req.headers || req.socket)
         ? req.headers["x-forwarded-for"] ||
           req.socket.remoteAddress ||
           "0.0.0.0"
         : "0.0.0.0";
   console.log(msg_app);
   if (typeof msg_app && msg_app !== undefined)
      msg_app = JSON.stringify(msg_app);
   msg_app = msg_app.substring(0, 499);
   const logData = {
      code,
      filename,
      fnction,
      msg_programmer,
      msg_app,
      ip,
      refer,
      tdate,
   };
   log.create(logData);
};

export function get_date() {
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
}
