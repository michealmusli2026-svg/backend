import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TradeNature = sequelize.define(
  "TradeNature",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nature: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "trade_nature", timestamps: true }
);

export default TradeNature;
