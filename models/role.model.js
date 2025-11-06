import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Role = sequelize.define(
  "Role",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false},
  },
  { tableName: "role", timestamps: true ,
     indexes: [
      { name: "idx_role_name", unique: true, fields: ["name"] },
    ],
  }
  
);

export default Role;
