import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Trade = sequelize.define(
  "Trade",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    initiatorId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    fromId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    fromQuantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fromRate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fromTotal:{
      type: DataTypes.DECIMAL(10,2),
      allowNull:false
    },
    toId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    toQuantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    toRate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    toTotal:{
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    commoditiesId: {
      type: DataTypes.INTEGER,
      references: { model: "commodities_list", key: "id" },
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
      // references: { model: "notes", key: "id" },
    },
    // nature: {
    //   type: DataTypes.INTEGER,
    //   references: { model: "trade_nature", key: "id" },
    // },
    paymentStatus: {
      type: DataTypes.INTEGER,
      references: { model: "payment_enum", key: "id" },
    },
    // rate: { type: DataTypes.FLOAT, allowNull: false },
    profit: { type: DataTypes.FLOAT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "trade", timestamps: true }
);

export default Trade;
