import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CurrencyFormat = sequelize.define(
  "CurrencyFormat",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "currency_format", timestamps: true }
);

export default CurrencyFormat;
