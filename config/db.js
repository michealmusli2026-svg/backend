import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  "tradeMaster",
  "imran",
  "786imran",
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false, // set true for SQL logs
  }
);

export default sequelize;