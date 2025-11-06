import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserBalance = sequelize.define(
  "userBalance",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    balance: { type: DataTypes.FLOAT },
    userId: { type: DataTypes.INTEGER, unique: true },
    lastTradeId: { type: DataTypes.INTEGER , defaultValue: null },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "userBalance", timestamps: false }
);

export default UserBalance;
