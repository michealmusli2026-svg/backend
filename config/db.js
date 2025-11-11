import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  "trade_master_prod",
  "root",
  "786@Imran",
  {
    host: "13.232.164.240",
    dialect: "mysql",
    port: 3306,
    logging: false, // set true for SQL logs
  }
);

// const sequelize = new Sequelize(
//   "tradeMaster",
//   "imran",
//   "786imran",
//   {
//     host: "localhost",
//     dialect: "mysql",
//     port: 3306,
//     logging: false, // set true for SQL logs
//   }
// );

export default sequelize;