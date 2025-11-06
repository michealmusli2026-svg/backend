import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CommoditiesList = sequelize.define(
  "CommoditiesList",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "commodities_list", timestamps: true }
);

export default CommoditiesList;
