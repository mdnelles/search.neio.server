const express = require('express'),
   cors = require('cors'),
   bodyParser = require('body-parser'),
   cookieParser = require('cookie-parser'),
   session = require('express-session'),
   app = express(),
   port = process.env.PORT || 5006,
   pj = require('./config/config.json'),
   path = require('path');

process.env.SECRET_KEY = 'secret2020xyz';
process.env.PF = '';

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(
   session({
      secret: pj.global.cookie_secret,
      proxy: true,
      httpOnly: false,
      resave: pj.global.cookie_resave,
      saveUninitialized: pj.global.cookie_saveUninitialized,
      cookie: {
         secure: false,
         httpOnly: false,
         path: '/'
      }
   })
);

app.use(
   bodyParser.urlencoded({
      extended: false
   })
);

var User = require('./routes/UserRoutes'),
   Dba = require('./routes/DbaRoutes'),
   Logs = require('./routes/LogRoutes'),
   Search = require('./routes/SearchRoutes');

app.use('/user', User);
app.use('/dba', Dba);
app.use('/logs', Logs);
app.use('/search', Search);

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
   // set static folder
   app.use(express.static('client/build'));

   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   });
}

app.listen(port, function() {
   console.log('Server is running on port: ' + port);
});
