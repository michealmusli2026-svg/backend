import { TradeNature, PaymentEnum, Role,CommoditiesList , CurrencyFormat} from "../models/index.js";

export const getTradeNature = async (req, res) => {
  const data = await TradeNature.findAll();
  res.json(data);
};

export const getPaymentStatus = async (req, res) => {
  const data = await PaymentEnum.findAll();
  res.json(data);
};

export const getRoles = async (req, res) => {
  const data = await Role.findAll();
  res.json(data);
};

export const saveEnums = async (req, res) => {
  try {
   const {
      tradeNatures = [],
      paymentStatuses = [],
      roles = [],
      commodities = [],
      currencies=[]
    } = req.body;
    console.log(req.body);

    if (tradeNatures && tradeNatures.length) {
      await TradeNature.bulkCreate(
        tradeNatures.map((nature) => ({ nature })),
      );
    }

    if (paymentStatuses && paymentStatuses.length) {
      await PaymentEnum.bulkCreate(
        paymentStatuses.map((status) => ({ status })),
      );
    }

    if (roles && roles.length) {
      await Role.bulkCreate(
        roles.map((name) => ({ name })),
      );
    }

    if (commodities && commodities.length) {
      // Assuming CommoditiesList model is imported
      await CommoditiesList.bulkCreate(
        commodities.map((name) => ({ name })),
      );
    }

    if (currencies && currencies.length) {
      // Assuming CurrencyFormat model is imported
      await CurrencyFormat.bulkCreate(
        currencies.map((code) => ({ code })),
      );
    }

    res.status(201).json({ message: "Enums saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getAllEnums = async (req, res) => {
  try {
    const tradeNatures = await TradeNature.findAll();
    const paymentStatuses = await PaymentEnum.findAll();
    const roles = await Role.findAll();
    const commodities = await CommoditiesList.findAll({ where: { active: true } });
    const currencies = await CurrencyFormat.findAll();

    res.json({
      tradeNatures,
      paymentStatuses,
      roles,
      commodities,
      currencies
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}