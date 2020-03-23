const express = require('express'),
   logs = express.Router(),
   cors = require('cors'),
   Log = require('../models/Logs');
(Logfn = require('../components/Logger')), (rf = require('./RoutFuctions'));

logs.use(cors());

let ip = '0.0.0.0';
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

logs.post('/get_logs', rf.verifyToken, (req, res) => {
   Log.findAll({
      order: [['id', 'DESC']]
   })
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'getusers',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('Client Error @ UserFunctions > get_logs' + err);
         res.status(404)
            .send('Error Location 102')
            .end();
      });
});

module.exports = logs;
