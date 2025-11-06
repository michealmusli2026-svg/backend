import express from "express";
import { getAllTrades, executeTrade ,saveTrade, deleteTrade, updateNote} from "../controllers/tradeController.js";
const router = express.Router();

router.get("/", getAllTrades);
router.post("/", executeTrade);
router.delete("/:id",deleteTrade)
router.post("/save", saveTrade);
router.post("/update",updateNote)

export default router;
