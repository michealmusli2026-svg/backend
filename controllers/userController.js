import {
  User,
  Role,
  UserBalance,
  CommoditiesStorage,
  CommoditiesList,
  sequelize,
  Trade,
  Notes,
  TradeNature,
  PaymentEnum,
  Party,
} from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({
//       include: [
//         {
//           model: Role,
//           attributes: ["name"], // Only get the role name
//         },
//         {
//           model: UserBalance,
//           attributes: ["balance"],
//         },
//         {
//           model: CommoditiesStorage,
//           include: [
//             {
//               model: CommoditiesList,
//               attributes: ["name", "id"],
//             },
//           ],
//         },
//       ],
//       attributes: { exclude: ["password"] }, // Hide sensitive data
//       order: [["id", "ASC"]], // Optional: sort users consistently
//     });

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "No users found." });
//     }

//     res.status(200).json({
//       count: users.length,
//       users,
//     });
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({
//       error: "Failed to fetch users.",
//       details: err.message,
//     });
//   }
// };

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
        {
          model: UserBalance,
          attributes: ["balance"],
        },
        {
          model: CommoditiesStorage,
          include: [
            {
              model: CommoditiesList,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]],
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Transform data into a clean API structure
    const formattedUsers = users.map((u) => ({
      id: u.id,
      username: u.username,
      // email: u.email,
      mobile: u.mobile,
      altMobile: u.altMobile,
      whatApp: u.whatApp,
      role: u.Role?.name || "N/A",
      balance: Number(u.openingBalance || 0),
      holdings: (u.CommoditiesStorages || []).map((cs) => ({
        commodityId: cs.CommoditiesList?.id,
        commodityName: cs.CommoditiesList?.name,
        quantity: cs.quantity,
      })),
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    res.status(200).json({
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      error: "Failed to fetch users.",
      details: err.message,
    });
  }
};

export const createUser = async (req, res) => {
  const t = await sequelize.transaction(); // start a transaction
  try {
    const {
      username,
      password,
      mobile,
      altMobile,
      whatApp,
      role,
      openingBalance,
      commoditiesHolding,
      currencyFormat,
    } = req.body;
    console.log("Creating user with data:", req.body);
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ error: "Username already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate role
    const getRole = await Role.findOne({ where: { id: role } });
    if (!getRole) {
      await t.rollback();
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // 1️⃣ Create User
    const user = await User.create(
      {
        // email: email,
        username: username,
        mobile: mobile,
        altMobile: altMobile,
        whatApp: whatApp,
        openingBalance: openingBalance,
        password: hashedPassword,
        role: role,
        currencyFormat: currencyFormat,
      },
      { transaction: t }
    );

    // 2️⃣ Create User Balance
    await UserBalance.create(
      {
        userId: user.id,
        balance: openingBalance || 0,
      },
      { transaction: t }
    );

    // 3️⃣ Create Commodities Storage (if provided)
    // currencies.map((code) => ({ code })),

    if (commoditiesHolding.length > 0) {
      const commoditiesHoldingIds = commoditiesHolding.map(
        (ch) => ch.commoditiesId
      );
      const validCommodities = await CommoditiesList.findAll({
        where: { id: commoditiesHoldingIds },
      });
      console.log(
        "Valid Commodities:",
        validCommodities.length,
        commoditiesHolding.length
      );
      // You can then verify that all requested commodities exist
      if (validCommodities.length !== commoditiesHolding.length) {
        return res.status(400).json({
          message: "Some commodities IDs are invalid",
        });
      }

      await CommoditiesStorage.bulkCreate(
        commoditiesHolding.map((commoditiesHolding) => ({
          userId: user.id,
          commoditiesId: commoditiesHolding.commoditiesId,
          quantity: commoditiesHolding.quantity || 0,
        })),
        { transaction: t }
      );
    }

    // ✅ Commit transaction if all succeeds
    await t.commit();

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: getRole.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ user: userData, token });
  } catch (err) {
    // ❌ Rollback on any error
    await t.rollback();
    res.status(400).json({ error: err.message, details: err.errors });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // make sure JWT_SECRET exists in .env
      { expiresIn: "1h" }
    );

    // Send user info without password
    const { password: _, ...userData } = user.toJSON();
    res.status(200).json({ user: userData, token });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const getUserTrade = async (req, res) => {
  try {
    const trades = await Trade.findAll({
      where: {
        initiatorId: req.params.userId,
      },
      include: [
        { model: User, as: "initiator" },
        { model: Party, as: "buyer" },
        { model: Party, as: "seller" },
        { model: CommoditiesList },
        { model: Notes },
        { model: TradeNature },
        { model: PaymentEnum },
      ],
      order: [["createdAt", req.params.order]],
      raw: false,
      nest: true,
    });
    const responseDatas = trades.map((trade) => {
      const t = trade.get({ plain: true }); // ✅ makes associations accessible
      console.log(">>>>", t);
      return {
        tradeId: t.id,
        initiator: { id: t.initiator?.id, value: t.initiator?.username },
        //FROM
        fromId: { id: t.buyer?.id, value: t.buyer?.username },
        fromRate: { id: null, value: t.fromRate },
        fromQuantity: { id: null, value: t.fromQuantity },
        fromTotal: { id: null, value: t.fromTotal },
        //To
        toId: { id: t.seller?.id, value: t.seller?.username },
        toRate: { id: null, value: t.toRate },
        toQuantity: { id: null, value: t.toQuantity },
        toTotal: { id: null, value: t.toTotal },
        //Profit
        profit: { id: null, value: t.profit },
        commodity: {
          id: t.CommoditiesList?.id,
          value: t.CommoditiesList?.name,
        },
        paymentStatus: { id: t.PaymentEnum?.id, value: t.PaymentEnum?.status },
        note: t.note,
        createdAt: t.createdAt,
      };
    });
    res.json(responseDatas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBalance = async (req, res) => {
  try {
    const userBalance = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!userBalance) {
      return res.status(404).json({ error: "User balance not found" });
    }
    res.status(200).json({ balance: userBalance.openingBalance });
  } catch (error) {}
};

export const getUserHoldings = async (req, res) => {
  try {
    const holding = await User.findAll({
      where: { id: req.params.userId },
      include: [
        {
          model: CommoditiesStorage,
          include: [
            {
              model: CommoditiesList,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!holding || holding.length === 0) {
      return res
        .status(404)
        .json({ message: "No holdings found for the user." });
    }

    const formattedHoldings = holding[0].CommoditiesStorages.map((cs) => ({
      commodityId: cs.CommoditiesList?.id,
      commodityName: cs.CommoditiesList?.name,
      quantity: cs.quantity,
    }));

    res.status(200).json({ holdings: formattedHoldings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const {
      username,
      password,
      mobile,
      altMobile,
      whatApp,
      role,
      openingBalance,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already in use" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get 'customer' role
    const getRole = await Role.findOne({ where: { name: "party" } });
    if (!getRole) {
      return res.status(400).json({ error: "Customer role not found" });
    }

    // Create User
    const user = await User.create({
      username: username,
      mobile: mobile,
      altMobile: altMobile,
      whatApp: whatApp,
      openingBalance: openingBalance,
      password: hashedPassword,
      role: getRole.id,
      currencyFormat: 1,
    });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ user: userData });
  } catch (err) {
    res.status(400).json({ error: err.message, details: err.errors });
  }
};

export const createParty = async (req, res) => {
  try {
    const { username, underUser, mobile, altMobile, whatApp, openingBalance } =
      req.body;

    // Check if user already exists
    const existingUser = await Party.findOne({ where: { username , underUser} });
    if (existingUser) {
      return res.status(400).json({ error: "Username already in use" });
    }
    // Get 'customer' role

    // Create User
    const user = await Party.create({
      username: username,
      mobile: mobile,
      altMobile: altMobile,
      whatApp: whatApp,
      openingBalance: openingBalance,
      currencyFormat: 1,
      underUser: underUser,
    });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ user: userData });
  } catch (err) {
    res.status(400).json({ error: err.message, details: err.errors });
  }
};

export const getAllParty = async (req, res) => {
  try {
    const allPartyList = await Party.findAll({
      where: { underUser: req.params.userId },
    });
    const modified = allPartyList.map((party) => ({
      ...party.toJSON(),
      balance: party.openingBalance,
      openingBalance: undefined,
    }));
    res.status(200).json({
      count: modified.length,
      users: modified,
    });
  } catch (error) {
    console.error("Error fetching party:", err);
    res.status(500).json({
      error: "Failed to fetch party.",
      details: err.message,
    });
  }
};
