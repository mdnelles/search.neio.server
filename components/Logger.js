const Log = require('../models/Logs');

exports.log2db = (
   code,
   filename,
   fnction,
   msg_programmer,
   msg_app,
   ip,
   refer
) => {
   console.log('inside log2db');
   const logData = {
      code,
      filename,
      fnction,
      msg_programmer,
      msg_app,
      ip,
      refer
   };
   Log.create(logData);
   //console.log('Data logged to DB: ' + logData);
};

exports.get_date = () => {
   let d = new Date();
   let month = parseInt(d.getMonth());
   month += 1;
   let tdate =
      d.getDate() +
      '-' +
      month +
      '-' +
      d.getFullYear() +
      ' - ' +
      d.getHours() +
      ':' +
      d.getMinutes() +
      ' ' +
      d.getSeconds();
   return tdate;
};
