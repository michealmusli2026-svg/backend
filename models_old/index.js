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
import CurrencyFormat from "./currencyList.model.js";

User.belongsTo(Role, { foreignKey: "role" });

// 2️⃣ USER ↔ COMMODITIES STORAGE
User.hasMany(CommoditiesStorage, { foreignKey: "userId" });
CommoditiesStorage.belongsTo(User, { foreignKey: "userId" });

// 3️⃣ COMMODITIES LIST ↔ STORAGE
CommoditiesList.hasMany(CommoditiesStorage, { foreignKey: "commoditiesId" });
CommoditiesStorage.belongsTo(CommoditiesList, { foreignKey: "commoditiesId" });

// 4️⃣ TRADE ↔ USER (Initiator / Participant)
Trade.belongsTo(User, { as: "initiator", foreignKey: "initiatorId" });
Trade.belongsTo(User, { as: "participant", foreignKey: "partID" });

// 5️⃣ TRADE ↔ COMMODITIES
Trade.belongsTo(CommoditiesList, { foreignKey: "commoditiesId" });

// 6️⃣ TRADE ↔ NOTES
Trade.belongsTo(Notes, { foreignKey: "noteId" });
Notes.belongsTo(Trade, { foreignKey: "tradeId" });

// 7️⃣ TRADE ↔ ENUMS (Nature / Payment)
Trade.belongsTo(TradeNature, { foreignKey: "nature" });
Trade.belongsTo(PaymentEnum, { foreignKey: "paymentStatus" });

// 8️⃣ USER BALANCE ↔ USER / TRADE
User.hasOne(UserBalance, { foreignKey: "userId" });
UserBalance.belongsTo(User, { foreignKey: "userId" });

User.hasOne(CurrencyFormat, { foreignKey: "currencyFormat" });

Trade.hasOne(UserBalance, { foreignKey: "lastTradeId" });
UserBalance.belongsTo(Trade, { foreignKey: "lastTradeId" });

// User.hasOne(UserBalance, { foreignKey: "userId" });
// User.hasOne(CommoditiesStorage, { foreignKey: "userId" });
// User.hasMany(Trade, { as: "initiator", foreignKey: "initiatorId" });
// User.hasMany(Notes, { foreignKey: "userId" });



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
  CurrencyFormat
};
