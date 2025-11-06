// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// module.exports = app;

import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import tradeRoutes from "./routes/trade.js";
import notesRoutes from "./routes/notes.js";
import commoditiesRoutes from "./routes/commodities.js";
import enumRoutes from "./routes/enums.js";
import sequelize from "./config/db.js";
import cors from "cors"; // <-- Add this line

dotenv.config();
const app = express();
app.use(cors()); // <-- Add wthis line
app.use(express.json());

// API routes
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully!");
    return sequelize.sync({ alter: true }); // creates/updates tables
    // return sequelize.sync({ force: true });

  })
  .then(() => {
    console.log("🧩 All models synced!");
    // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Database connection error:", err));
app.use("/api/users", userRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/commodities", commoditiesRoutes);
app.use("/api/enums", enumRoutes);


export default app;


// router.get('/admin', authenticate('admin'), someController);