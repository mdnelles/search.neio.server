const express = require('express'),
   search = express.Router(),
   cors = require('cors'),
   Search = require('../models/Search'),
   SearchTypes = require('../models/SearchTypes'),
   Sequelize = require('sequelize'),
   db = require('../database/db');
rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

search.use(cors());

search.post('/add_entry', rf.verifyToken, (req, res) => {
   // this is to populate the drop down for categorizing codebase search entries
   var date1 = get_date();
   var date2 = Math.round(new Date().getTime() / 1000);
   ttype = decodeURIComponent(req.body.ttype);
   title = decodeURIComponent(req.body.title);
   keywords = decodeURIComponent(req.body.keywords);
   intro = decodeURIComponent(req.body.intro);
   code = decodeURIComponent(req.body.code);
   let codeData = {
      ttype,
      title,
      keywords,
      intro,
      code,
      date1,
      date2
   };

   Search.create(codeData)
      .then((data) => {
         if (data) {
            res.send(data);
         } else {
            res.json({ error: 'could not load new entry' });
            console.log('Err Searchroutes.add_entry: ' + err);
         }
      })
      .catch((err) => {
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
            console.log('just create new category: ' + data);
            res.send(data);
         } else {
            res.json({ error: 'could not load new entry' });
            console.log('Err Searchroutes.add_cat: ' + err);
         }
      })
      .catch((err) => {
         res.json({ error: err });
         console.log('Err Searchroutes.add_cat: ' + err);
      });
});

search.post('/get_ttypes', rf.verifyToken, (req, res) => {
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
         res.json({ error: err });
      });
});

search.post('/get_titles', rf.verifyToken, (req, res) => {
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
            res.json({ error: 'no data to send' });
         }
      })
      .catch((err) => {
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
                        res.json({ error: 'no data to send' });
                     }
                  }
               })
               .catch((err2) => {
                  // error on query 2
                  console.log('err(2):' + err2);
                  res.json({ error: err2 });
               });
         } else {
            res.json({ error: 'no data to send' });
         }
      })
      .catch((err) => {
         console.log('err:' + err);
         res.json({ error: err });
      });
});

module.exports = search;

const get_date = () => {
   let d = new Date();
   let month = parseInt(d.getMonth());
   month += 1;
   let tdate =
      d.getDate() +
      '-' +
      month +
      '-' +
      d.getFullYear() +
      '~~' +
      d.getHours() +
      ':' +
      d.getMinutes() +
      ' ' +
      d.getSeconds();
   return tdate;
};
