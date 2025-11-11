import sequelize from "../config/db.js";
import User from "./user.model.js";
import Role from "./role.model.js";
import Trade from "./trade.model.js";
import TradeNature from "./tradeNature.model.js";
import PaymentEnum from "./paymentEnum.model.js";
import CommoditiesList from "./commoditiesList.model.js";
import CommoditiesStorage from "./commoditiesStorage.model.js";
import Notes from "./notes.model.js";
import UserBalance from "./userBalance.model.js";
import CurrencyFormat from "./currencyFormat.model.js";
import Party from "./party.model.js"

// 1️⃣ USER ↔ ROLE
User.belongsTo(Role, { foreignKey: "role" });

// 2️⃣ USER ↔ STORAGE
User.hasMany(CommoditiesStorage, { foreignKey: "userId" });
CommoditiesStorage.belongsTo(User, { foreignKey: "userId" });

// 3️⃣ COMMODITIES ↔ STORAGE
CommoditiesList.hasMany(CommoditiesStorage, { foreignKey: "commoditiesId" });
CommoditiesStorage.belongsTo(CommoditiesList, { foreignKey: "commoditiesId" });

// 4️⃣ TRADE ↔ USERS (Initiator / Partner)
Trade.belongsTo(User, { as: "initiator", foreignKey: "initiatorId" });
Trade.belongsTo(Party, { as: "seller", foreignKey: "toId" });
Trade.belongsTo(Party, { as: "buyer", foreignKey: "fromId" });

// 5️⃣ TRADE ↔ COMMODITIES
Trade.belongsTo(CommoditiesList, { foreignKey: "commoditiesId" });

// 6️⃣ TRADE ↔ NOTES
Trade.belongsTo(Notes, { foreignKey: "noteId" });
Notes.belongsTo(Trade, { foreignKey: "tradeId" });

// 7️⃣ TRADE ↔ ENUMS
Trade.belongsTo(TradeNature, { foreignKey: "nature" });
Trade.belongsTo(PaymentEnum, { foreignKey: "paymentStatus" });

// 8️⃣ USER BALANCE ↔ USER
User.hasOne(UserBalance, { foreignKey: "userId" });
UserBalance.belongsTo(User, { foreignKey: "userId" });

// 9️⃣ USER ↔ CURRENCY
User.belongsTo(CurrencyFormat, { foreignKey: "currencyFormat" });

export {
  sequelize,
  User,
  Role,
  Trade,
  TradeNature,
  PaymentEnum,
  CommoditiesList,
  CommoditiesStorage,
  Notes,
  UserBalance,
  CurrencyFormat,
  Party
};
