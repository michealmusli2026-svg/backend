import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PaymentEnum = sequelize.define(
  "PaymentEnum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "payment_enum", timestamps: true }
);

export default PaymentEnum;
