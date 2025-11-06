import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Trade = sequelize.define(
  "Trade_OLD",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    initiatorId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    buyerId:{
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    sellerId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    commoditiesId: {
      type: DataTypes.INTEGER,
      references: { model: "commodities_list", key: "id" },
    },
    noteId: {
      type: DataTypes.INTEGER,
      references: { model: "notes", key: "id" },
    },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    nature: {
      type: DataTypes.INTEGER,
      references: { model: "trade_nature", key: "id" },
    },
    paymentStatus: {
      type: DataTypes.INTEGER,
      references: { model: "payment_enum", key: "id" },
    },
    rate: { type: DataTypes.FLOAT, allowNull: false },
    totalAmount:{type: DataTypes.FLOAT , allowNull:false},
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "Trade_OLD", timestamps: true }
);

export default Trade;
