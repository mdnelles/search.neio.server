const express = require("express");
const app = express();
const env = dotenv.config().parsed;

// Middleware function to check the referring URL or user's IP
export const validateReferrerOrIP = (req, res, next) => {
   const referrer = req.get("Referrer");
   const userIP = req.ip;
   const adminIP = env.ADMINIP;

   if (referrer && referrer.includes(env.ALLOOWED_DOMANI)) {
      // Referring URL is nnn.io, allow access
      next();
   } else if (userIP === adminIP) {
      // User's IP matches ADMINIP, allow access
      next();
   } else {
      // Unauthorized access
      res.status(403).send("Unauthorized");
   }
};
