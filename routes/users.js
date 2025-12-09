import express from "express";
import { getAllUsers, createUser, loginUser, getUserTrade, getUserBalance, getUserHoldings,updateTrade, createCustomer,createParty, getAllParty } from "../controllers/userController.js";
import { updateBalance } from "../controllers/balanceController.js";
const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/login",loginUser)
router.post("/updateBalance",updateBalance)
router.get("/trade/:userId/:order/:complete/:offset",getUserTrade)
router.get("/balance/:userId",getUserBalance)
router.get("/holdings/:userId",getUserHoldings)
router.post("/createCustomer",createCustomer)
router.post("/create/party",createParty)
router.get("/party/:userId",getAllParty)
router.post("/trade/update",updateTrade)

export default router;
