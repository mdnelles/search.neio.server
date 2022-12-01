import * as dotenv from "dotenv";
import Sequelize from "sequelize";

const { NODE_DB_HOST, NODE_DB_NAME, NODE_DB_PASS, NODE_DB_USER } =
   dotenv.config().parsed;
export const db = {};

console.log(dotenv.config());

const sequelize = new Sequelize(NODE_DB_NAME, NODE_DB_USER, NODE_DB_PASS, {
   port: 3306,
   host: NODE_DB_HOST,
   dialect: "mysql",

   pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
   },
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
