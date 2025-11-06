import express from "express";
import { getTradeNature, getPaymentStatus ,saveEnums,getAllEnums} from "../controllers/enumController.js";
const router = express.Router();

router.get("/tradeNature", getTradeNature);
router.get("/paymentStatus", getPaymentStatus);
router.post("/createEnum", saveEnums);
router.get("/",getAllEnums);

export default router;
