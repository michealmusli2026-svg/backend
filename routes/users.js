import express from "express";
import { getAllUsers, createUser, loginUser, getUserTrade, getUserBalance, getUserHoldings, createCustomer } from "../controllers/userController.js";
import { updateBalance } from "../controllers/balanceController.js";
const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/login",loginUser)
router.post("/updateBalance",updateBalance)
router.get("/trade/:userId/:order",getUserTrade)
router.get("/balance/:userId",getUserBalance)
router.get("/holdings/:userId",getUserHoldings)
router.post("/createCustomer",createCustomer)

export default router;
