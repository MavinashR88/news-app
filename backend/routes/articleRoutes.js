// backend/routes/articleRoutes.js
const express = require("express");
const router = express.Router();
const fetchAndSaveNews = require("../utils/fetchNews");
const Article = require("../models/Article");
const User = require("../models/User");

// Fetch news and save to database
router.get("/fetch-news", async (req, res) => {
  try {
    await fetchAndSaveNews();
    res.json({ message: "News fetched and saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
});

// Like an article
router.post("/:id/like", async (req, res) => {
  const { userId } = req.body;

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Check if the user has already liked the article
    if (article.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has already liked this article" });
    }

    // If the user previously disliked the article, remove their dislike
    article.dislikedBy = article.dislikedBy.filter(
      (id) => id.toString() !== userId
    );
    article.likes += 1;
    article.likedBy.push(userId);

    await article.save();
    res.json({ likes: article.likes, dislikes: article.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dislike an article
router.post("/:id/dislike", async (req, res) => {
  const { userId } = req.body;

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Check if the user has already disliked the article
    if (article.dislikedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has already disliked this article" });
    }

    // If the user previously liked the article, remove their like
    article.likedBy = article.likedBy.filter((id) => id.toString() !== userId);
    article.dislikes += 1;
    article.dislikedBy.push(userId);

    await article.save();
    res.json({ likes: article.likes, dislikes: article.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comment on an article

router.post("/:id/comment", async (req, res) => {
  const { userId, content } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = {
      userId,
      userName: user.name, // Assuming `user.name` exists in your User model
      content,
      createdAt: new Date(),
    };

    article.comments.push(comment);
    await article.save();

    res.json(article.comments); // Send updated comments back to frontend
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all articles
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles" });
  }
});

module.exports = router;
