import * as dotenv from "dotenv";
const env = dotenv.config();

import express from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import session from "express-session";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = env.PORT || 5010;

app.use(
   session({
      secret: env.NODE_SECRET,
      proxy: true,

      httpOnly: false,
      resave: env.NODE_COOKIE_RESAVE,
      saveUninitialized: env.NODE_COOKIE_SAVE_UNINITIALZED,
      cookie: {
         secure: false,
         httpOnly: false,
         path: "/",
      },
   })
);
app.use(cors());
// create application/json parser
var jsonParser = json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

import User from "./routes/UserRoutes";
import Dba from "./routes/DbaRoutes";
import Logs from "./routes/LogRoutes";
import Todo from "./routes/Todo";
import Note from "./routes/Note";
import Search from "./routes/SearchRoutes";

app.use("/sv-user", User);
app.use("/sv-dba", Dba);
app.use("/sv-logs", Logs);
app.use("/sv-note", Note);
app.use("/sv-search", Search);
app.use("/sv-todo", Todo);

// serve static assets if in production
if (env.NODE_ENV === "production") {
   // set static folder
   //app.use(static("client/build"));

   app.get("*", (req, res) => {
      res.sendFile(resolve(__dirname, "client", "build", "index.html"));
   });
}

app.listen(port, function () {
   console.log("Server is running on port: " + port);
});
