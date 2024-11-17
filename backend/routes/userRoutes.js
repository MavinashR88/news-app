// routes/userRoutes.js

const express = require("express");
const {
  getProfile,
  updateUserProfile,
  getReadingHistory,
  getSavedArticles,
  updateSubscription,
  saveArticle,
  markAsRead,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.get("/reading-history", verifyToken, getReadingHistory);
router.get("/saved-articles", verifyToken, getSavedArticles);
router.put("/subscription", verifyToken, updateSubscription);
router.post("/save-article", verifyToken, saveArticle);
router.post("/mark-as-read", verifyToken, markAsRead);

module.exports = router;
