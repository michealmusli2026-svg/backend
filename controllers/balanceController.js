import { UserBalance } from "../models/index.js";

// NEVER USE THIS
export const updateBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Find existing balance record
    let userBalance = await UserBalance.findOne({ where: { userId } });

    if (userBalance) {
      userBalance.balance += amount;
      await userBalance.save();
    } else {
      // Create new balance record
      userBalance = await UserBalance.create({ userId, balance: amount });
    }

    res.status(200).json(userBalance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}