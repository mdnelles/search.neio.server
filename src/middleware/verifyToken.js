import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

const tokenTest = (token, res, jwt, caller, next) => {
   const { NODE_SECRET } = dotenv.config().parsed;

   jwt.verify(token, NODE_SECRET, (error) => {
      if (error) {
         console.log("bad token(2):\n\t" + NODE_SECRET + "\n\t" + token);
         console.log(error);
         res.json({
            err: true,
            status: 201,
            msg: "login again to obtain new token",
            error,
         });
      } else {
         console.log("token ok caller -> " + caller);
         next(); // Next middleware
      }
   });
};

export function verifyToken(req, res, next) {
   const token = req.body.token || req.headers.token || "";
   const caller = req.body.caller || "NA";

   try {
      tokenTest(token, res, jwt, caller, next);
   } catch (error) {
      console.log("token fail" + caller + "token fail=" + token);
      console.log(error);
      res.sendStatus(403);
   }
}
