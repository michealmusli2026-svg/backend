import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CommoditiesStorage = sequelize.define(
  "CommoditiesStorage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    commoditiesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "commodities_list", key: "id" },
    },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "commodities_storage", timestamps: true }
);

export default CommoditiesStorage;
