import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TradeNature = sequelize.define(
  "TradeNature",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true  , autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "tradeNature", timestamps: false }
);

export default TradeNature;
