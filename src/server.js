import * as dotenv from "dotenv";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./middleware/verifyToken.js";
import { validateReferrerOrIP } from "./middleware/validateSender.js";
import fetch from "node-fetch";

global.fetch = fetch;

const env = dotenv.config().parsed;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const port = env.PORT || 5010;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create application/x-www-form-urlencoded parser
app.use(compression());
app.use(express.json());
app.use(jsonParser);
app.use(urlencodedParser);
app.use(helmet());

//import * as logs from "./routes/LogRoutes.js";
import * as user from "./routes/UserRoutes.js";
import * as todo from "./routes/TodoRoutes.js";
import * as search from "./routes/SearchRoutes.js";
import * as note from "./routes/NoteRoutes.js";
import * as chat from "./routes/ChatRoutes.js";
import * as sm from "./routes/SqlToMongo.js";

app.post("/sv-user/login", user.login);
app.post("/sv-note/upd_entry", verifyToken, note.upd_entry);
app.post("/sv-note/fetch", verifyToken, note.fetch);

app.post("/sv-search/add_entry", verifyToken, search.add_entry);
app.post("/sv-search/add_cat", verifyToken, search.add_cat);
app.post("/sv-search/get_ttypes", verifyToken, search.get_ttypes);
app.post("/sv-search/get_titles", verifyToken, search.get_titles);
app.post("/sv-search/del_entry", verifyToken, search.del_one);
app.post("/sv-search/del_cat", verifyToken, search.del_cat);
app.post("/sv-search/upd_entry", verifyToken, search.upd_one);
app.post("/sv-search/do_query", verifyToken, search.do_query);
app.post("/sv-search/find_one", verifyToken, search.find_one);
app.post("/sv-search/removeFile", verifyToken, search.removeFile);
app.post("/sv-search/uploadfile", verifyToken, search.uploadfile);

app.post("/sv-todo/add_entry", verifyToken, todo.add_entry);
app.post("/sv-todo/del_entry", verifyToken, todo.del_entry);
app.post("/sv-todo/upd_entry", verifyToken, todo.upd_entry);
app.post("/sv-todo/get_todo", verifyToken, todo.get_todo);

app.all("/chat/wait", chat.chatWait);

//app.all("/sm/convert", sm.convertSQLToMongo);

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
