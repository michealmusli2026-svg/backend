
import { Notes, Trade } from "../models/index.js";

export const getNotes = async (req, res) => {
  const notes = await Notes.findAll({ include: Trade });
  res.json(notes);
};

export const createNote = async (req, res) => {
  try {
    const { message, tradeId } = req.body;
    const note = await Notes.create({ message, tradeId });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
