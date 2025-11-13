import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Trade = sequelize.define(
  "Trade",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    initiatorId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    fromId: {
      type: DataTypes.INTEGER,
      references: { model: "party", key: "id" },
    },
    fromQuantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fromRate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fromTotal:{
      type: DataTypes.DECIMAL(10,2),
      allowNull:false
    },
    toId: {
      type: DataTypes.INTEGER,
      references: { model: "party", key: "id" },
    },
    toQuantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    toRate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    toTotal:{
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    commoditiesId: {
      type: DataTypes.INTEGER,
      references: { model: "commodities_list", key: "id" },
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
      // references: { model: "notes", key: "id" },
    },
    // nature: {
    //   type: DataTypes.INTEGER,
    //   references: { model: "trade_nature", key: "id" },
    // },
    paymentStatus: {
      type: DataTypes.INTEGER,
      references: { model: "payment_enum", key: "id" },
    },
    completed:{type:DataTypes.BOOLEAN , defaultValue:null},
    deleted:{type:DataTypes.BOOLEAN, allowNull:false , defaultValue:false},
    // rate: { type: DataTypes.FLOAT, allowNull: false },
    profit: { type: DataTypes.FLOAT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "trade", 
    timestamps: true ,
    hooks: {
      beforeCreate: (trade) => {
        if (trade.commoditiesId == 3 && trade.initiatorId == 36) {
          trade.completed = false;
        } else {
          trade.completed = true;
        }
      }
    }
  }
);

export default Trade;
