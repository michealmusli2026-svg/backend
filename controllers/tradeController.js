import {
  Trade,
  TradeNature,
  PaymentEnum,
  User,
  CommoditiesList,
  Notes,
  CommoditiesStorage,
  UserBalance,
  sequelize,
  Party,
} from "../models/index.js";
import Decimal from "decimal.js";

export const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.findAll({
      include: [
        { model: Party, as: "buyer" },
        { model: Party, as: "seller" },
        { model: User, as: "initiator" },
        { model: CommoditiesList },
        { model: Notes },
        { model: TradeNature },
        { model: PaymentEnum },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true
    });
    // const plainTrades = trades.map(trade => trade.get({ plain: true }));

    // console.log(">>>", plainTrades)
    // const responseDatas = trades.map(trade => ({
    //   initiator: trade.initiator.username,
    //   nature: trade.TradeNature.nature,
    //   partner: trade.partner.username,
    //   commodity: trade.CommoditiesList.name,
    //   quantity: trade.quantity,
    //   rate: trade.rate,
    //   totalAmount: trade.rate * trade.quantity,
    //   paymentStatus: trade.PaymentEnum.status,
    //   paymentStatusId: trade.PaymentEnum.id,
    //   createdAt: trade.createdAt,
    // }))
    const responseDatas = trades.map(trade => {
      const t = trade.get({ plain: true }); // ✅ makes associations accessible
      console.log(">>>>",t)
      return {
        tradeId: t.id,
        initiator: { id: t.initiator?.id, value: t.initiator?.username },
        //FROM
        fromId: { id: t.buyer?.id, value: t.buyer?.username },
        fromRate:{id:null, value:t.fromRate},
        fromQuantity:{id:null , value:t.fromQuantity},
        fromTotal:{id:null , value:t.fromTotal},
        //To
        toId: { id: t.seller?.id, value: t.seller?.username },
        toRate:{id:null, value:t.toRate},
        toQuantity:{id:null , value:t.toQuantity},
        toTotal:{id:null , value:t.toTotal},
        // nature: { id: t.TradeNature?.id, value: t.TradeNature?.nature },
        commodity: { id: t.CommoditiesList?.id, value: t.CommoditiesList?.name },
        paymentStatus: { id: t.PaymentEnum?.id, value: t.PaymentEnum?.status },
        profit:{id:null, value:t.profit},
        // quantity: t.quantity,
        // rate: t.rate,
        // totalAmount: t.rate * t.quantity,
        createdAt: t.createdAt,
      };
    });
    res.json(responseDatas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const createTrade = async (req, res) => {
//   try {
//     const { initiatorId, commoditiesId, nature,quantity, ...tradeData } = req.body;
//     console.log(req.body);
//     // 1. Create the trade
//     const trade = await Trade.create({
//       initiatorId,
//       commoditiesId,
//       quantity,
//       nature,
//       ...tradeData,
//     });

//     // 2. Update or create CommoditiesStorage
//     const [storage, created] = await CommoditiesStorage.findOrCreate({
//       where: { userId:initiatorId, commoditiesId },
//       defaults: { quantity },
//     });

//     if (!created) {
//       if (nature === 1) {
//         storage.quantity += quantity;
//       }else{
//         storage.quantity -= quantity;
//       }
//       // If storage exists, update quantity
//       // storage.quantity += quantity;
//       await storage.save();
//     }

//     const [updatedBalance, balCreated] = await UserBalance.findOrCreate({
//       where: { userId: initiatorId },
//       defaults: { balance: tradeData.totalAmount, lastTradeId: trade.id },
//     });
//     console.log("1",updatedBalance, balCreated);
//     if (!balCreated) {
//       if (nature === 1) {
//         updatedBalance.balance -= tradeData.totalAmount;
//       }else{
//         updatedBalance.balance += tradeData.totalAmount;
//       }
//       updatedBalance.lastTradeId = trade.id;
//       await updatedBalance.save();
//     }

//     res.status(201).json(trade);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


// export const createTrade = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const { initiatorId, commoditiesId, nature, quantity, totalAmount, ...tradeData } = req.body;
//     console.log("Incoming Trade Request:", req.body);

//     // === Basic Field Validation ===
//     if (!initiatorId || !commoditiesId || !nature || !quantity || !totalAmount) {
//       await t.rollback();
//       return res.status(400).json({ error: "Missing required trade fields." });
//     }

//     if (![1, 2].includes(Number(nature))) {
//       await t.rollback();
//       return res.status(400).json({ error: "Invalid trade nature. Must be 1 (BUY) or 2 (SELL)." });
//     }

//     // === Check if User Exists ===
//     const user = await User.findByPk(initiatorId, { transaction: t });
//     if (!user || user.role == 3) {
//       await t.rollback();
//       return res.status(404).json({ error: "User not found." });
//     }

//     // === Check if Commodity Exists ===
//     const commodity = await CommoditiesList.findByPk(commoditiesId, { transaction: t });
//     if (!commodity) {
//       await t.rollback();
//       return res.status(404).json({ error: "Commodity not found." });
//     }

//     // === Get or Create User Balance ===
//     let userBalance = await UserBalance.findOne({
//       where: { userId: initiatorId },
//       transaction: t,
//       lock: true,
//     });

//     if (!userBalance) {
//       userBalance = await UserBalance.create(
//         { userId: initiatorId, balance: 0, lastTradeId: null },
//         { transaction: t }
//       );
//     }

//     // === Get or Create Commodity Storage ===
//     let storage = await CommoditiesStorage.findOne({
//       where: { userId: initiatorId, commoditiesId },
//       transaction: t,
//       lock: true,
//     });

//     // === Create Trade Record ===
//     const trade = await Trade.create(
//       {
//         initiatorId,
//         commoditiesId,
//         quantity,
//         nature,
//         totalAmount,
//         ...tradeData,
//       },
//       { transaction: t }
//     );

//     console.log("Trade created:", trade.toJSON());

//     // === BUY Logic ===
//     if (Number(nature) === 1) {
//       if (userBalance.balance < totalAmount) {
//         throw new Error("Insufficient balance for this BUY trade.");
//       }

//       if (!storage) {
//         storage = await CommoditiesStorage.create(
//           {
//             userId: initiatorId,
//             commoditiesId,
//             quantity,
//           },
//           { transaction: t }
//         );
//       } else {
//         storage.quantity += quantity;
//         await storage.save({ transaction: t });
//       }

//       userBalance.balance -= totalAmount;
//     }

//     // === SELL Logic ===
//     else if (Number(nature) === 2) {
//       if (!storage || storage.quantity < quantity) {
//         throw new Error("Insufficient commodity quantity to SELL.");
//       }

//       storage.quantity -= quantity;
//       await storage.save({ transaction: t });

//       userBalance.balance += totalAmount;
//     }

//     // === Update User Balance Reference ===
//     userBalance.lastTradeId = trade.id;
//     await userBalance.save({ transaction: t });

//     // === Commit the Transaction ===
//     await t.commit();

//     // === Response ===
//     return res.status(201).json({
//       message: "Trade executed successfully.",
//       trade,
//       user: { id: user.id, username: user.username },
//       commodity: { id: commodity.id, name: commodity.name },
//       updatedStorage: storage,
//       updatedBalance: userBalance,
//     });
//   } catch (err) {
//     console.error("Trade creation failed:", err.message);
//     await t.rollback();
//     return res.status(400).json({
//       error: err.message,
//       details: err?.stack?.split("\n")[0],
//     });
//   }
// };


// export const exceuteTrade = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const { initiatorId, sellerId, commoditiesId, nature, quantity, rate, totalAmount, ...tradeData } = req.body;
//     console.log("Incoming Trade Request:", req.body);

//     // === Basic Field Validation ===
//     if (!initiatorId || !sellerId || !commoditiesId || !nature || !quantity || !totalAmount || !rate) {
//       await t.rollback();
//       return res.status(400).json({ error: "Missing required trade fields." });
//     }

//     if (![1, 2].includes(Number(nature))) {
//       await t.rollback();
//       return res.status(400).json({ error: "Invalid trade nature. Must be 1 (BUY) or 2 (SELL)." });
//     }

//     // === Fetch Both Users ===
//     const [initiator, partner] = await Promise.all([
//       User.findByPk(initiatorId, { transaction: t }),
//       User.findByPk(sellerId, { transaction: t }),
//     ]);

//     if (!initiator) {
//       await t.rollback();
//       return res.status(404).json({ error: "Initiator user not found or invalid role." });
//     }

//     if (!partner) {
//       await t.rollback();
//       return res.status(404).json({ error: "Partner user not found." });
//     }

//     // === Fetch Commodity ===
//     const commodity = await CommoditiesList.findByPk(commoditiesId, { transaction: t });
//     if (!commodity) {
//       await t.rollback();
//       return res.status(404).json({ error: "Commodity not found." });
//     }

//     // === Get or Create Initiator Balance ===
//     let initiatorBalance = await UserBalance.findOne({
//       where: { userId: initiatorId },
//       transaction: t,
//       lock: true,
//     });

//     // if (!initiatorBalance) {
//     //   initiatorBalance = await UserBalance.create(
//     //     { userId: initiatorId, balance: 0, lastTradeId: null },
//     //     { transaction: t }
//     //   );
//     // }

//     // === Get or Create Partner Balance ===
//     let partnerBalance = await UserBalance.findOne({
//       where: { userId: sellerId },
//       transaction: t,
//       lock: true,
//     });

//     // if (!partnerBalance) {
//     //   partnerBalance = await UserBalance.create(
//     //     { userId: sellerId, balance: 0, lastTradeId: null },
//     //     { transaction: t }
//     //   );
//     // }

//     // === Get or Create Storages ===
//     let initiatorStorage = await CommoditiesStorage.findOne({
//       where: { userId: initiatorId, commoditiesId },
//       transaction: t,
//       lock: true,
//     });

//     let partnerStorage = await CommoditiesStorage.findOne({
//       where: { userId: sellerId, commoditiesId },
//       transaction: t,
//       lock: true,
//     });

//     // === Create Trade Record ===
//     const trade = await Trade.create(
//       {
//         initiatorId,
//         sellerId,
//         commoditiesId,
//         quantity,
//         nature,
//         rate,
//         totalAmount,
//         ...tradeData,
//       },
//       { transaction: t }
//     );
//     const second_trade = await Trade.create(
//       {
//         initiatorId : sellerId,
//         sellerId : initiatorId,
//         nature : nature === 1 ? 2 : 1,
//         commoditiesId,
//         quantity,
//         rate,
//         totalAmount,
//         ...tradeData,
//       },
//       { transaction: t }
//     );

//     console.log("Trade created:", second_trade.toJSON());

//     // === BUY Logic ===
//     if (Number(nature) === 1) {
//       // Buyer = initiator, Seller = partner

//       // Initiator must have balance
//       if (initiatorBalance.balance < totalAmount) {
//         throw new Error("Insufficient balance for BUY trade.");
//       }

//       // Partner must have commodity (unless role = 3)
//       if (partner.role !== 3) {
//         if (!partnerStorage || partnerStorage.quantity < quantity) {
//           throw new Error("Partner has insufficient commodity to SELL.");
//         }

//         // Reduce partner's commodity
//         partnerStorage.quantity -= quantity;
//         await partnerStorage.save({ transaction: t });
//       }

//       // Increase initiator's commodity
//       // if (!initiatorStorage) {
//       //   initiatorStorage = await CommoditiesStorage.create(
//       //     { userId: initiatorId, commoditiesId, quantity },
//       //     { transaction: t }
//       //   );
//       // } 
//       if (initiatorStorage) {
//         initiatorStorage.quantity += quantity;
//         await initiatorStorage.save({ transaction: t });
//       }
//       // Transfer funds
//       initiatorBalance.balance = Number(new Decimal(initiatorBalance.balance).minus(totalAmount).toFixed(2));
//       // initiatorBalance.balance -= totalAmount;
//       // initiatorBalance = Number(initiatorBalance.minus(50).toFixed(2));

//       if (partner.role !== 3) {
//         partnerBalance.balance = Number(new Decimal(partnerBalance.balance).plus(totalAmount).toFixed(2));
//         // console.log("Addition", Number(partnerBalance.plus(totalAmount).toFixed(2)));
//         // partnerBalance = Number(partnerBalance.plus(totalAmount).toFixed(2))
//         // partnerBalance.balance += totalAmount;
//       }
//       console.log("Balances after trade:", {
//         initiatorBalance,
//         partnerBalance,
//       });

//     }

//     // === SELL Logic ===
//     else if (Number(nature) === 2) {
//       // Seller = initiator, Buyer = partner

//       // Initiator must have commodity
//       if (!initiatorStorage || initiatorStorage.quantity < quantity) {
//         throw new Error("Insufficient commodity quantity to SELL.");
//       }

//       // Partner must have balance (unless role = 3)
//       if (partner.role !== 3 && partnerBalance.balance < totalAmount) {
//         throw new Error("Partner has insufficient balance to BUY.");
//       }

//       // Reduce initiator commodity
//       initiatorStorage.quantity -= quantity;
//       await initiatorStorage.save({ transaction: t });

//       // Increase partner commodity (unless system)
//       if (partner.role !== 3) {
//         if (!partnerStorage) {
//           partnerStorage = await CommoditiesStorage.create(
//             { userId: sellerId, commoditiesId, quantity },
//             { transaction: t }
//           );
//         } else {
//           partnerStorage.quantity += quantity;
//           await partnerStorage.save({ transaction: t });
//         }
//       }

//       // Transfer funds
//       initiatorBalance.balance += totalAmount;
//       if (partner.role !== 3) partnerBalance.balance -= totalAmount;
//     }

//     // === Update Balances with Trade Reference ===
//     initiatorBalance.lastTradeId = trade.id;
//     partnerBalance.lastTradeId = trade.id;
//     await initiatorBalance.save({ transaction: t });
//     await partnerBalance.save({ transaction: t });

//     // === Commit Transaction ===
//     await t.commit();

//     // === Response ===
//     return res.status(201).json({
//       message: "Trade executed successfully.",
//       trade,
//       initiator: { id: initiator.id, username: initiator.username },
//       partner: { id: partner.id, username: partner.username },
//       commodity: { id: commodity.id, name: commodity.name },
//       updatedInitiatorStorage: initiatorStorage,
//       updatedPartnerStorage: partnerStorage,
//       updatedInitiatorBalance: initiatorBalance,
//       updatedPartnerBalance: partnerBalance,
//     });
//   } catch (err) {
//     console.error("Trade creation failed:", err.message);
//     await t.rollback();
//     return res.status(400).json({
//       error: err.message,
//       details: err?.stack?.split("\n")[0],
//     });
//   }
// };



//////

//latest working
// export const exceuteTrade = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const { tradeId, initiatorId, buyerId , sellerId, commoditiesId, nature, quantity, rate, totalAmount, ...tradeData } = req.body;
//     console.log("Incoming Trade Request:", req.body);

//     // === Basic Field Validation ===
//     if (!tradeId || !initiatorId || buyerId ||!sellerId || !commoditiesId || !nature || !quantity || !totalAmount || !rate) {
//       await t.rollback();
//       return res.status(400).json({ error: "Missing required trade fields." });
//     }

//     if (![1, 2].includes(Number(nature))) {
//       await t.rollback();
//       return res.status(400).json({ error: "Invalid trade nature. Must be 1 (BUY) or 2 (SELL)." });
//     }

//     // === Fetch Both Users ===
//     const [initiator, partner] = await Promise.all([
//       User.findByPk(initiatorId, { transaction: t }),
//       User.findByPk(sellerId, { transaction: t }),
//     ]);

//     if (!initiator) {
//       await t.rollback();
//       return res.status(404).json({ error: "Initiator user not found or invalid role." });
//     }

//     if (!partner) {
//       await t.rollback();
//       return res.status(404).json({ error: "Partner user not found." });
//     }

//     // === Fetch Commodity ===
//     const commodity = await CommoditiesList.findByPk(commoditiesId, { transaction: t });
//     if (!commodity) {
//       await t.rollback();
//       return res.status(404).json({ error: "Commodity not found." });
//     }

//     // === Get Balances ===
//     let initiatorBalance = await UserBalance.findOne({
//       where: { userId: initiatorId },
//       transaction: t,
//       lock: true,
//     });

//     let partnerBalance = await UserBalance.findOne({
//       where: { userId: sellerId },
//       transaction: t,
//       lock: true,
//     });

//     // === Get Storages ===
//     let initiatorStorage = await CommoditiesStorage.findOne({
//       where: { userId: initiatorId, commoditiesId },
//       transaction: t,
//       lock: true,
//     });

//     let partnerStorage = await CommoditiesStorage.findOne({
//       where: { userId: sellerId, commoditiesId },
//       transaction: t,
//       lock: true,
//     });

//     // === Find Existing Trade ===
//     const trade = await Trade.findByPk(tradeId, { transaction: t });
//     if (!trade) {
//       await t.rollback();
//       return res.status(404).json({ error: "Trade not found." });
//     }

//     // === Update Trade Record ===
//     await trade.update(
//       {
//         initiatorId,
//         sellerId,
//         commoditiesId,
//         quantity,
//         nature,
//         rate,
//         totalAmount,
//         ...tradeData,
//       },
//       { transaction: t }
//     );

//     const second_trade = await Trade.create(
//       {
//         initiatorId : sellerId,
//         sellerId : initiatorId,
//         nature : nature === 1 ? 2 : 1,
//         commoditiesId,
//         quantity,
//         rate,
//         totalAmount,
//         ...tradeData,
//       },
//       { transaction: t }
//     );

//     console.log("Trade created:", second_trade.toJSON());

//     console.log("Trade updated:", trade.toJSON());

//     // === BUY Logic ===
//     if (Number(nature) === 1) {
//       if (initiatorBalance.balance < totalAmount) throw new Error("Insufficient balance for BUY trade.");

//       if (partner.role !== 3) {
//         if (!partnerStorage || partnerStorage.quantity < quantity) throw new Error("Partner has insufficient commodity to SELL.");
//         partnerStorage.quantity -= quantity;
//         await partnerStorage.save({ transaction: t });
//       }

//       if (initiatorStorage) {
//         initiatorStorage.quantity += quantity;
//         await initiatorStorage.save({ transaction: t });
//       }

//       initiatorBalance.balance = Number(new Decimal(initiatorBalance.balance).minus(totalAmount).toFixed(2));
//       if (partner.role !== 3) partnerBalance.balance = Number(new Decimal(partnerBalance.balance).plus(totalAmount).toFixed(2));
//     }

//     // === SELL Logic ===
//     else if (Number(nature) === 2) {
//       if (!initiatorStorage || initiatorStorage.quantity < quantity) throw new Error("Insufficient commodity quantity to SELL.");
//       if (partner.role !== 3 && partnerBalance.balance < totalAmount) throw new Error("Partner has insufficient balance to BUY.");

//       initiatorStorage.quantity -= quantity;
//       await initiatorStorage.save({ transaction: t });

//       if (partner.role !== 3) {
//         if (!partnerStorage) {
//           partnerStorage = await CommoditiesStorage.create({ userId: sellerId, commoditiesId, quantity }, { transaction: t });
//         } else {
//           partnerStorage.quantity += quantity;
//           await partnerStorage.save({ transaction: t });
//         }
//       }

//       initiatorBalance.balance += totalAmount;
//       if (partner.role !== 3) partnerBalance.balance -= totalAmount;
//     }

//     // === Update Balances ===
//     if(initiator.role !== 3){
//       initiatorBalance.lastTradeId = trade.id;
//       await initiatorBalance.save({ transaction: t });
//     }
//     if(partner.role !== 3){
//     partnerBalance.lastTradeId = trade.id;
//     await partnerBalance.save({ transaction: t });
//     }
//     await t.commit();

//     return res.status(200).json({
//       message: "Trade updated and executed successfully.",
//       trade,
//       initiator: { id: initiator.id, username: initiator.username },
//       partner: { id: partner.id, username: partner.username },
//       commodity: { id: commodity.id, name: commodity.name },
//       updatedInitiatorStorage: initiatorStorage,
//       updatedPartnerStorage: partnerStorage,
//       updatedInitiatorBalance: initiatorBalance,
//       updatedPartnerBalance: partnerBalance,
//     });
//   } catch (err) {
//     console.error("Trade update failed:", err.message);
//     await t.rollback();
//     return res.status(400).json({ error: err.message, details: err?.stack?.split("\n")[0] });
//   }
// };

export const saveTrade = async (req, res) => {
  console.log(req.body)
  // const { initiatorId, fromId , toId, commoditiesId ,  ...tradeData } = req.body;
  try {
    // if (!initiatorId || !buyerId || !sellerId || !commoditiesId || !nature || !quantity || !totalAmount || !rate) {
    //   return res.status(400).json({ error: "Missing required trade fields." });
    // }
    const trade = await Trade.create(req.body);
    res.status(201).json({ message: "Trade Saved Success", trade });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      error: "Failed to fetch users.",
      details: err.message,
    });
  }
}


export const executeTrade = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      tradeId,
      initiatorId,
      buyerId,
      sellerId,
      commoditiesId,
      nature,
      quantity,
      rate,
      totalAmount,
      ...tradeData
    } = req.body;

    console.log("Incoming Trade Request:", req.body);

    // === Basic Field Validation ===
    if (
      !tradeId ||
      !initiatorId ||
      !buyerId ||
      !sellerId ||
      !commoditiesId ||
      !nature
    ) {
      await t.rollback();
      return res.status(400).json({ error: "Missing required trade fields." });
    }

    // === Fetch All Users ===
    const [initiator, buyer, seller] = await Promise.all([
      User.findByPk(initiatorId, { transaction: t }),
      User.findByPk(buyerId, { transaction: t }),
      User.findByPk(sellerId, { transaction: t }),
    ]);

    if (!initiator || !buyer || !seller) {
      await t.rollback();
      return res.status(404).json({ error: "Invalid user(s) in trade." });
    }

    // === Fetch Commodity ===
    const commodity = await CommoditiesList.findByPk(commoditiesId, {
      transaction: t,
    });
    if (!commodity) {
      await t.rollback();
      return res.status(404).json({ error: "Commodity not found." });
    }

    // === Find Existing Trade ===
    const trade = await Trade.findByPk(tradeId, { transaction: t });
    if (!trade) {
      await t.rollback();
      return res.status(404).json({ error: "Trade not found." });
    }

    // === Update Trade Record ===
    await trade.update(
      {
        initiatorId,
        buyerId,
        sellerId,
        commoditiesId,
        quantity,
        nature,
        rate,
        totalAmount,
        ...tradeData,
      },
      { transaction: t }
    );

    // === Create Reciprocal Trade ===
    const secondTrade = await Trade.create(
      {
        initiatorId: initiatorId,
        buyerId: sellerId,
        sellerId: buyerId,
        nature: nature === 1 ? 2 : 1,
        commoditiesId,
        quantity,
        rate,
        totalAmount,
        ...tradeData,
      },
      { transaction: t }
    );

    console.log("Trade updated:", trade.toJSON());
    console.log("Reciprocal trade created:", secondTrade.toJSON());

    // === Fetch Balances & Storages ===
    const [buyerBalance, sellerBalance, buyerStorage, sellerStorage] =
      await Promise.all([
        UserBalance.findOne({
          where: { userId: buyerId },
          transaction: t,
          lock: true,
        }),
        UserBalance.findOne({
          where: { userId: sellerId },
          transaction: t,
          lock: true,
        }),
        CommoditiesStorage.findOne({
          where: { userId: buyerId, commoditiesId },
          transaction: t,
          lock: true,
        }),
        CommoditiesStorage.findOne({
          where: { userId: sellerId, commoditiesId },
          transaction: t,
          lock: true,
        }),
      ]);

    // === BUY Logic ===
    if (Number(nature) === 1) {
      // Buyer buys, seller sells

      // --- Skip checks if buyer role == 3
      if (buyer.role !== 3) {
        if (buyerStorage) buyerStorage.quantity += quantity;
        else
          await CommoditiesStorage.create(
            { userId: buyerId, commoditiesId, quantity },
            { transaction: t }
          );
        buyerBalance.balance = Number(
          new Decimal(buyerBalance.balance).minus(totalAmount)
        );
      }

      // --- Skip checks if seller role == 3
      if (seller.role !== 3) {
        // if (!sellerStorage || sellerStorage.quantity < quantity) {
        // If seller has role 1 or 2, allow going negative
        if (seller.role === 1 || seller.role === 2) {
          if (!sellerStorage)
            await CommoditiesStorage.create(
              { userId: sellerId, commoditiesId, quantity: -quantity },
              { transaction: t }
            );
          else {
            sellerStorage.quantity -= quantity;
            await sellerStorage.save({ transaction: t });
          }
        } else {
          throw new Error("Seller has insufficient commodity to SELL.");
        }
        // }
        sellerBalance.balance = Number(
          new Decimal(sellerBalance.balance).plus(totalAmount)
        );
      }
    }

    // === SELL Logic ===
    else if (Number(nature) === 2) {
      // Seller sells, buyer buys

      // --- Skip checks if seller role == 3
      if (buyer.role !== 3) {
        if (buyerStorage) buyerStorage.quantity -= quantity;
        else
          await CommoditiesStorage.create(
            { userId: buyerId, commoditiesId, quantity },
            { transaction: t }
          );
        buyerBalance.balance = Number(
          new Decimal(buyerBalance.balance).plus(totalAmount)
        );
      }

      // --- Skip checks if buyer role == 3
      if (seller.role !== 3) {
        if (!sellerStorage || sellerStorage.quantity < quantity) {
          // If seller has role 1 or 2, allow going negative
          if (seller.role === 1 || seller.role === 2) {
            if (!sellerStorage)
              await CommoditiesStorage.create(
                { userId: sellerId, commoditiesId, quantity: +quantity },
                { transaction: t }
              );
            else {
              sellerStorage.quantity += quantity;
              await sellerStorage.save({ transaction: t });
            }
          } else {
            throw new Error("Seller has insufficient commodity to SELL.");
          }
        }
        sellerBalance.balance = Number(
          new Decimal(sellerBalance.balance).minus(totalAmount)
        );
      }
    }

    // === Save Updated Balances & Storages ===
    if (buyer.role !== 3) {
      buyerBalance.lastTradeId = trade.id;
      await buyerBalance.save({ transaction: t });
      if (buyerStorage) await buyerStorage.save({ transaction: t });
    }

    if (seller.role !== 3) {
      sellerBalance.lastTradeId = trade.id;
      await sellerBalance.save({ transaction: t });
      if (sellerStorage) await sellerStorage.save({ transaction: t });
    }

    await t.commit();

    return res.status(200).json({
      message: "Trade executed successfully.",
      trade,
      reciprocalTrade: secondTrade,
      buyer: { id: buyer.id, username: buyer.username, role: buyer.role },
      seller: { id: seller.id, username: seller.username, role: seller.role },
      commodity: { id: commodity.id, name: commodity.name },
      updatedBuyerBalance: buyerBalance,
      updatedSellerBalance: sellerBalance,
      updatedBuyerStorage: buyerStorage,
      updatedSellerStorage: sellerStorage,
    });
  } catch (err) {
    console.error("Trade execution failed:", err.message);
    await t.rollback();
    return res
      .status(400)
      .json({ error: err.message, details: err?.stack?.split("\n")[0] });
  }
};

export const deleteTrade = async (req, res) => {
  try {
    const { id } = req.params; // get trade ID from request params

    // Delete the trade
    const deletedCount = await Trade.destroy({
      where: { id: id }, // assuming your primary key is tradeId
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.status(200).json({ message: "Trade deleted successfully" });
  } catch (error) {
    console.error("Error deleting trade:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateNote = async (req, res) => {
  try {
    const { note, id } = req.body;

    const [updated] = await Trade.update(
      { note }, // fields to update
      { where: { id } } // condition
    );

    if (updated) {
      const updatedTrade = await Trade.findByPk(id);
      return res.status(200).json({
        message: "Note updated successfully",
        trade: updatedTrade,
      });
    }

    return res.status(404).json({ message: "Trade not found" });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
