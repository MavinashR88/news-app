const express = require("express");
const {
  getProfile,
  updateUserProfile,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateUserProfile);

module.exports = router;
