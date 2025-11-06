import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserBalance = sequelize.define(
  "UserBalance",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    balance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 },
    lastTradeId: {
      type: DataTypes.INTEGER,
      references: { model: "trade", key: "id" },
    },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "user_balance", timestamps: true }
);

export default UserBalance;
