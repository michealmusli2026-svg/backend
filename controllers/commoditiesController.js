import {
  CommoditiesList,
  CommoditiesStorage,
  User,
} from "../models/index.js";

export const getCommodities = async (req, res) => {
  try {
    const list = await CommoditiesList.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCommodity = async (req, res) => {
  try {
    const { name } = req.body;
    const item = await CommoditiesList.create({ name });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserStorage = async (req, res) => {
  try {
    const data = await CommoditiesStorage.findAll({
      include: [User, CommoditiesList],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUserStorage = async (req, res) => {
  try {
    const { userId, commoditiesId, quantity } = req.body;
    const storage = await CommoditiesStorage.create({
      userId,
      commoditiesId,
      quantity,
    });
    res.status(201).json(storage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
