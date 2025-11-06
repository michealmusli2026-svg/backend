import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    Ref: { type: DataTypes.STRING, allowNull: true },
    mobile: { type: DataTypes.STRING(15), allowNull: false },
    altMobile: { type: DataTypes.STRING(15), allowNull: true },
    whatApp: { type: DataTypes.STRING(15), allowNull: true },
    openingBalance: { type: DataTypes.INTEGER, allowNull: false },
    currencyFormat: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "role", key: "id" },
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      { name: "idx_users_username", unique: true, fields: ["username"] },
    ],
  }
);

export default User;
