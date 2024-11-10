// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as necessary
const verifyToken = require("../middlewares/authMiddleware"); // Ensure only admins have access

// Route to get all users
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
