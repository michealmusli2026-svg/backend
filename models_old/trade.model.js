import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Trade = sequelize.define(
  "Trade",
  {
    tradeID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    initiatorId: { type: DataTypes.INTEGER, allowNull: false },
    partID: { type: DataTypes.INTEGER, allowNull: false },
    commoditiesId: { type: DataTypes.INTEGER, allowNull: false },
    rate: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    noteId: { type: DataTypes.INTEGER },
    nature: { type: DataTypes.INTEGER ,allowNull: false },
    paymentStatus: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "trade", timestamps: false }
);

export default Trade;
