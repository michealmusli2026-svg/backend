import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CommoditiesList = sequelize.define(
  "CommoditiesList",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false , unique: true},
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "commoditiesList", timestamps: false }
);

export default CommoditiesList;
