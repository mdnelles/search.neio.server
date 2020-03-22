const express = require('express'),
   search = express.Router(),
   cors = require('cors'),
   Search = require('../models/Search'),
   SearchTypes = require('../models/SearchTypes'),
   Sequelize = require('sequelize'),
   db = require('../database/db'),
   fileUpload = require('express-fileupload'),
   fs = require('fs-extra'),
   path = require('path'),
   Logfn = require('../components/Logger'),
   rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

search.use(cors());
search.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

let ip = '0.0.0.0';
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

search.post('/add_entry', rf.verifyToken, (req, res) => {
   // this is to populate the drop down for categorizing codebase search entries
   var date1 = get_date();
   var date2 = Math.round(new Date().getTime() / 1000);
   var ttype = decodeURIComponent(req.body.ttype);
   var title = decodeURIComponent(req.body.title);
   var keywords = decodeURIComponent(req.body.keywords);
   var intro = decodeURIComponent(req.body.intro);
   var code = decodeURIComponent(req.body.code);
   var image = decodeURIComponent(req.body.fileName);
   //var fileSize = decodeURIComponent(req.body.fileSize);
   let codeData = {
      ttype,
      title,
      keywords,
      intro,
      code,
      date1,
      date2,
      image
   };

   Search.create(codeData)
      .then((data) => {
         if (data) {
            res.send(data);
         } else {
            Logfn.log2db(
               500,
               fileName,
               'add_entry.1',
               'could not insert into Search',
               '',
               ip,
               req.headers.referer,
               tdate
            );
            res.json({ error: 'could not load new entry' });
            console.log('Err Searchroutes.add_entry: ' + err);
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'add_entry.2',
            'Searchroutes.add_entry',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: err });
         console.log('Err Searchroutes.add_entry: ' + err);
      });
});

search.post('/add_cat', rf.verifyToken, (req, res) => {
   // this is to populate the drop down for categorizing codebase search entries
   ttype = decodeURIComponent(req.body.category);

   let codeData = {
      ttype
   };

   SearchTypes.create(codeData)
      .then((data) => {
         if (data) {
            res.send(data);
         } else {
            res.json({ error: 'could not load new entry' });
            console.log('Err Searchroutes.add_cat: ' + err);
            Logfn.log2db(
               500,
               fileName,
               'add_cat',
               '',
               err,
               ip,
               req.headers.referer,
               tdate
            );
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'add_cat',
            err,
            '',
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: err });
         console.log('Err Searchroutes.add_cat: ' + err);
      });
});

search.post('/get_ttypes', rf.verifyToken, (req, res) => {
   let ref = req.headers.referer;
   // this is to populate the drop down for categorizing codebase search entries
   SearchTypes.findAll({
      attributes: ['id', 'ttype'],
      order: [['ttype', 'ASC']]
   })
      .then((data) => {
         if (data) {
            res.send(data);
         } else {
            res.json({ error: 'no data to send' });
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'get_types',
            'catch err',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: err });
      });
});

search.post('/get_titles', rf.verifyToken, (req, res) => {
   let ref = req.headers.referer;
   Search.findAll({
      attributes: ['id', 'title'],
      where: {
         isDeleted: 0
      },
      order: [['title', 'ASC']]
   })
      .then((data) => {
         if (data) {
            res.send(data);
         } else {
            Logfn.log2db(
               500,
               fileName,
               'get_ttype',
               'no data to send',
               '',
               ip,
               req.headers.referer,
               tdate
            );
            res.json({ error: 'no data to send' });
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'get_ttype',
            'no data to send',
            '',
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: err });
      });
});

search.post('/del_entry', rf.verifyToken, (req, res) => {
   console.log('in del_entry id = ' + req.body.id);
   Search.destroy({ where: { id: req.body.id } }, { limit: 1 })
      .then((data) => {
         res.send('200').end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'del_entry',
            'no data to send',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('err: SearchRoutes.del_entry: ' + err);
         res.json({ error: err });
      });
});

search.post('/del_cat', rf.verifyToken, (req, res) => {
   SearchTypes.destroy({ where: { id: req.body.id } }, { limit: 1 })
      .then(() => {
         res.send('200').end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'del_cat',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('err: SearchRoutes.del_cat: ' + err);
         res.json({ error: err });
      });
});

search.post('/upd_entry', rf.verifyToken, (req, res) => {
   console.log('in upd_entries');
   Search.update(
      {
         title: req.body.title,
         code: req.body.code,
         intro: req.body.intro
      },
      { where: { id: req.body.id } },
      { limit: 1 }
   )
      .then((data) => {
         res.send('200').end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'upd_entry',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('err:' + err);
         res.json({ error: err });
      });
});

search.post('/do_query', rf.verifyToken, (req, res) => {
   console.log('in doQuery');
   let query = decodeURI(req.body.query).toString();
   //console.log(req);
   Search.findAll({
      where: {
         title: {
            [Sequelize.Op.like]: '%' + query + '%'
         }
      }
   })
      .then((data) => {
         console.log('got data from first query');
         if (data) {
            data.forEach((e) => {
               e.search1 = true;
            });
            //console.log(data);
            // now do second query for looser fitting results
            db.sequelize
               .query(
                  'SELECT * FROM searches WHERE !(title LIKE :search) AND code LIKE :search ORDER BY date2 DESC ',
                  {
                     replacements: { search: `%${query}%` },
                     type: Sequelize.QueryTypes.SELECT
                  }
               )
               .then((data2) => {
                  // if second query returned result
                  if (data2) {
                     let allData = data.concat(data2);
                     res.send(allData); // send back the data
                  } else {
                     if (data) {
                        res.send(allData);
                     } else {
                        Logfn.log2db(
                           500,
                           fileName,
                           'do_query',
                           'no data',
                           '',
                           ip,
                           req.headers.referer,
                           tdate
                        );
                        res.json({ error: 'no data to send' });
                     }
                  }
               })
               .catch((err2) => {
                  // error on query 2
                  Logfn.log2db(
                     500,
                     fileName,
                     'do_query',
                     'catch',
                     err2,
                     ip,
                     req.headers.referer,
                     tdate
                  );
                  console.log('err(2):' + err2);
                  res.json({ error: err2 });
               });
         } else {
            Logfn.log2db(
               500,
               fileName,
               'do_query',
               'catch',
               err,
               ip,
               req.headers.referer,
               tdate
            );
            res.json({ error: 'no data to send' });
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'do_query',
            'catch.2',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('err:' + err);
         res.json({ error: err });
      });
});

search.post('/removeFile', rf.verifyToken, (req, res) => {
   console.log('in removeFile');
   const path = '../client/public/upload/';
   const fileName = req.body.fileName;

   // With Promises:
   fs.remove('./tmp/myfile');
   fs.remove(path + fileName)
      .then(() => {
         console.log('success delete file: ' + fileName);
         res.send('ok').end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'removeFile',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.error('Failed in deleting file ' + fileName + ' Err: ' + err);
         res.send('failed to delete file').end();
      });
});

search.post('/uploadfile', rf.verifyToken, function(req, res) {
   var mime = req.files.files.mimetype.toString();
   let pathToUpload = __dirname
      .toString()
      .replace('/server/routes', '/client/build/upload/')
      .replace('//', '/');
   console.log('In upload file path = ' + pathToUpload);

   //if(fn.includes(".php") || fn.includes(".js") ||  fn.includes(".pl") || fn.includes(".htm")|| fn.includes(".exe") || fn.includes(".txt") || !fn.includes(".")){
   if (
      mime.includes('image') ||
      mime.includes('audio') ||
      mime.includes('video')
   ) {
      req.files.files.mv(pathToUpload + req.files.files.name, function(err) {
         if (err) {
            Logfn.log2db(
               500,
               fileName,
               'uploadfile',
               'fail during upload',
               err,
               ip,
               req.headers.referer,
               tdate
            );
            console.log('Error: ' + err);
            res.send('SearchRoutes.uploadfileUpload failed' + err).end();
         } else {
            console.log('Uploaded ok');
            res.end('File uploaded successfully');
         }
      });
   } else {
      Logfn.log2db(
         500,
         fileName,
         'uploadfile',
         'Illegal file type',
         '',
         ip,
         req.headers.referer,
         tdate
      );
      console.log('Illegal file type');
      res.send('Illegal file type').end();
   }
});

module.exports = search;
