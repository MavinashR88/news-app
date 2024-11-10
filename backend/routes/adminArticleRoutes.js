// backend/routes/adminArticleRoutes.js
const express = require("express");
const {
  getAllArticles,
  editArticle,
  deleteArticle,
  approveArticle,
} = require("../controllers/adminArticleController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/articles", verifyToken, getAllArticles);
router.put("/articles/:id", verifyToken, editArticle);
router.delete("/articles/:id", verifyToken, deleteArticle);
router.put("/articles/:id/approve", verifyToken, approveArticle);

module.exports = router;
