import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PaymentEnum = sequelize.define(
  "PaymentEnum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true , autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "paymentEnum", timestamps: false }
);

export default PaymentEnum;
