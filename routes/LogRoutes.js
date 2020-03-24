const express = require('express'),
   logs = express.Router(),
   cors = require('cors'),
   db = require('../database/db'),
   Sequelize = require('sequelize'),
   Log = require('../models/Logs');
(Logfn = require('../components/Logger')), (rf = require('./RoutFuctions'));

logs.use(cors());

let ip = '0.0.0.0';
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

logs.post('/get_logs', rf.verifyToken, (req, res) => {
   let code = 500;
   if (req.body.code !== undefined) code = req.body.code;
   console.log(req.body.perPage);
   let perPage = 20;
   if (req.body.perPage !== undefined) perPage = req.body.perPage;

   db.sequelize
      .query(
         'SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC limit :perPage',
         {
            replacements: {
               code: code,
               perPage: perPage
            },
            type: Sequelize.QueryTypes.SELECT
         }
      )
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'get_logs',
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

logs.post('/get_logcount', rf.verifyToken, (req, res) => {
   let code = 500;
   if (req.body.code !== undefined) code = req.body.code;

   db.sequelize
      .query('SELECT count(*) FROM logs WHERE code = :code ', {
         replacements: {
            code: code
         },
         type: Sequelize.QueryTypes.SELECT
      })
      .then((data) => {
         console.log(data);
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'get_count (logs)',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('Server @ LogRoutes.get_count' + err);
         res.status(200)
            .send('Error LogRoutes.get_count')
            .end();
      });
});

module.exports = logs;
