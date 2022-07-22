require("dotenv").config();

var express = require("express"),
   cors = require("cors"),
   app = express(),
   bodyParser = require("body-parser"),
   port = process.env.PORT || 5010,
   session = require("express-session"),
   path = require("path");

app.use(
   session({
      secret: process.env.NODE_SECRET,
      proxy: true,
      httpOnly: false,
      resave: process.env.NODE_COOKIE_RESAVE,
      saveUninitialized: process.env.NODE_COOKIE_SAVE_UNINITIALZED,
      cookie: {
         secure: false,
         httpOnly: false,
         path: "/",
      },
   })
);
app.use(cors());
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

var User = require("./routes/UserRoutes"),
   Dba = require("./routes/DbaRoutes"),
   Logs = require("./routes/LogRoutes"),
   Todo = require("./routes/Todo"),
   Note = require("./routes/Note"),
   Search = require("./routes/SearchRoutes");

app.use("/user", User);
app.use("/dba", Dba);
app.use("/logs", Logs);
app.use("/note", Note);
app.use("/search", Search);
app.use("/todo", Todo);

// serve static assets if in production
if (process.env.NODE_ENV === "production") {
   // set static folder
   app.use(express.static("client/build"));

   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

app.listen(port, function () {
   console.log("Server is running on port: " + port);
});
