import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Notes = sequelize.define(
  "Notes",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tradeId: {
      type: DataTypes.INTEGER,
      references: { model: "trade", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    content: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "notes", timestamps: true }
);

export default Notes;
