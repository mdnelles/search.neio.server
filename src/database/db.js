import * as dotenv from "dotenv";
import Sequelize from "sequelize";

const { NODE_DB_HOST, NODE_DB_NAME, NODE_DB_PASS, NODE_DB_USER } =
   dotenv.config().parsed;
export const db = {};

const sequelize = new Sequelize(NODE_DB_NAME, NODE_DB_USER, NODE_DB_PASS, {
   host: NODE_DB_HOST,
   dialect: "mysql",
   logging: console.log,
   freezeTableName: true,

   pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
   },
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
