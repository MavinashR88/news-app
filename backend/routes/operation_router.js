const express = require("express");
const router = express.Router();
const controller = require("../controllers/operation_controller");
router.get("/articles", controller.getAllArticles);
const Article = require("../models/Article"); // Adjust the path based on your project structure
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const authMiddleware = require("../middlewares/authMiddleware");
// --- Article Routes ---

// Like an article
router.post("/articles/:articleId/like", controller.likeArticle);

// Dislike an article
router.post("/articles/:articleId/dislike", controller.dislikeArticle);

// Add a comment to an article
router.post("/articles/:articleId/comments", controller.addComment);

// Fetch comments
router.get("/articles/:articleId/comments", controller.fetchComments);

// --- User Routes ---

// Get user profile
router.get("/users/:userId/profile", controller.getUserProfile);

// Update user profile
router.put("/users/:userId/profile", controller.updateUserProfile);

// Save an article to user's saved articles
router.post("/users/:userId/save-article", controller.saveArticle);
router.get("/users/:userId/saved-articles", controller.getSavedArticles);
// Mark an article as read
router.post("/users/:userId/mark-read", controller.markAsRead);

// Get user's reading history
router.get("/users/:userId/reading-history", controller.getReadingHistory);
// Search articles route
router.get("/search", controller.searchArticles);
// Update user subscription
router.post(
  "/users/:userId/update-subscription",
  controller.updateSubscription
);
router.get(
  "/users/:userId/published-articles",
  controller.getPublishedArticles
);

router.get("/articles/search", async (req, res) => {
  const { searchTerm, category } = req.query;

  try {
    const query = {};
    if (category && category !== "All") {
      const categoryObject = await Category.findOne({
        name: { $regex: new RegExp(category, "i") },
      });
      if (categoryObject) {
        query.category = categoryObject._id;
      } else {
        return res.status(200).json([]); // No results for unknown category
      }
    }
    if (searchTerm) {
      query.title = { $regex: new RegExp(searchTerm, "i") };
    }

    const articles = await Article.find(query).populate("category");
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error in search route:", error.message);
    res.status(500).json({ message: "Failed to fetch articles." });
  }
});

router.put("/users/:userId/block", controller.blockUser);

const User = require("../models/User"); // Import User model (to get user details)

// Save article as draft
// Save article as draft
router.post("/articles/draft", authMiddleware, controller.saveAsDraft);
router.get(
  "/users/:userId/draft-articles",
  controller.getDraftArticles // Use the controller to handle fetching draft articles
);

// Route: Update article status
router.put(
  "/articles/:articleId/status",
  authMiddleware,
  controller.updateArticleStatus
);

// Get all draft articles

module.exports = router;
