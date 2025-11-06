import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CommoditiesStorage = sequelize.define(
  "CommoditiesStorage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // tradeId: { type: DataTypes.INTEGER, allowNull: false },
    commoditiesId: { type: DataTypes.INTEGER, allowNull: false },
    // rate:{ type: DataTypes.FLOAT, allowNull: true },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "commoditiesStorage", timestamps: false }
);

export default CommoditiesStorage;
