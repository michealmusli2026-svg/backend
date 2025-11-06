import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Notes = sequelize.define(
  "Notes",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.STRING },
    tradeId: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "notes", timestamps: false }
);

export default Notes;
