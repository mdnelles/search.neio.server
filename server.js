require("dotenv").config();

var express = require("express"),
   cors = require("cors"),
   app = express(),
   port = process.env.PORT || 5010,
   session = require("express-session"),
   path = require("path");

app.use(cors());
app.use(express.json());
app.use(
   session({
      secret: process.env.NODE_JS_SECRET,
      proxy: true,
      httpOnly: false,
      resave: process.env.NODE_JS_COOKIE_RESAVE,
      saveUninitialized: process.env.NODE_COOKIE_SAVE_UNINITIALZED,
      cookie: {
         secure: false,
         httpOnly: false,
         path: "/",
      },
   })
);
app.use(
   express.urlencoded({
      extended: true,
   })
);
app.use(express.json());
app.use(
   express.urlencoded({
      extended: true,
   })
);

var User = require("./routes/UserRoutes"),
   Dba = require("./routes/DbaRoutes"),
   Logs = require("./routes/LogRoutes"),
   Search = require("./routes/SearchRoutes");

app.use("/user", User);
app.use("/dba", Dba);
app.use("/logs", Logs);
app.use("/search", Search);

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
