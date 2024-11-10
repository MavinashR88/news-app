// backend/routes/adminUserRoutes.js
const express = require("express");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminUserController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Ensure only admins can access these routes
router.get("/users", verifyToken, getAllUsers);
router.put("/users/:id", verifyToken, updateUserRole);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;
