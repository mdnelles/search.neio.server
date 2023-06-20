import express from "express";
const app = express();
import { config as dotenvConfig } from "dotenv";

const env = dotenvConfig().parsed;

// Middleware function to check the referring URL or user's IP
export const validateReferrerOrIP = (req, res, next) => {
   const referrer = req.get("Referrer");
   const userIP = req.ip;
   const adminIP = env.ADMINIP;
   const headers = req.headers;
   console.log(req.headers["referer"]);

   console.log(headers);
   console.log(referrer);
   if (referrer && referrer.includes(env.ALLOWED_DOMAIN)) {
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
