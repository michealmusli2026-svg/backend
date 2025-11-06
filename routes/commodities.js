import express from "express";
import {
  getCommodities,
  addCommodity,
  getUserStorage,
  addUserStorage,
} from "../controllers/commoditiesController.js";

const router = express.Router();

router.get("/", getCommodities);
router.post("/", addCommodity);
router.get("/storage", getUserStorage);
router.post("/storage", addUserStorage);

export default router;
