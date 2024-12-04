const express = require("express");
const axios = require("axios"); // Import axios to make HTTP requests
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");

const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;

// Fetch and save news route
router.get("/fetch-news", async (req, res) => {
  try {
    console.log("Fetching news from API...");
    const response = await axios.get(API_URL);
    const articles = response.data.articles;

    console.log("Fetched Articles:", articles); // Log fetched articles

    // Ensure articles exist before saving
    if (articles && articles.length > 0) {
      for (const article of articles) {
        const newsArticle = new Article({
          title: article.title,
          description: article.description,
          source: article.source.name,
          url: article.url,
          urlToImage: article.urlToImage,
          date: new Date(article.publishedAt || Date.now()),
          viewCount: 0,
        });

        // Log article before saving
        console.log("Saving article:", newsArticle);
        await newsArticle.save();
      }

      res.status(201).json({ message: "News fetched and saved to database!" });
    } else {
      console.log("No articles found from API.");
      res.status(404).json({ error: "No articles found from the API." });
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news." });
  }
});

// Get all articles route
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find(); // Fetch all articles
    res.json(articles); // Send articles as JSON response
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

router.post("/:id/like", async (req, res) => {
  const { userId } = req.body;

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Ensure this user can independently like the article
    if (!article.likedBy.includes(userId)) {
      // Remove user from dislikedBy array if they disliked earlier
      article.dislikedBy = article.dislikedBy.filter(
        (id) => id.toString() !== userId
      );

      // Add user to likedBy array and increment the like count
      article.likes += 1;
      article.likedBy.push(userId);
    }

    await article.save();
    res.json({
      message: "Article liked successfully",
      likes: article.likes,
      dislikes: article.dislikes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/:id/dislike", async (req, res) => {
  const { userId } = req.body;

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Ensure this user can independently dislike the article
    if (!article.dislikedBy.includes(userId)) {
      // Remove user from likedBy array if they liked earlier
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== userId
      );

      // Add user to dislikedBy array and increment the dislike count
      article.dislikes += 1;
      article.dislikedBy.push(userId);
    }

    await article.save();
    res.json({
      message: "Article disliked successfully",
      likes: article.likes,
      dislikes: article.dislikes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Increment view count and save to read history
router.post("/:id/update", async (req, res) => {
  const { viewCount } = req.body;
  const userId = req.body.userId;

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    article.viewCount = viewCount;
    await article.save();

    if (userId) {
      const user = await User.findById(userId);
      if (user && !user.readingHistory.includes(article._id)) {
        user.readingHistory.push(article._id);
        await user.save();
      }
    }

    res.status(200).json({ message: "View count updated and history saved." });
  } catch (error) {
    res.status(500).json({ message: "Error updating view count." });
  }
});

// Comment on an article
router.post("/:id/comment", async (req, res) => {
  const { userId, content } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = {
      userId,
      userName: user.name,
      content,
      createdAt: new Date(),
    };

    article.comments.push(comment);
    await article.save();

    res
      .status(200)
      .json({
        message: "Comment added successfully",
        comments: article.comments,
      });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment." });
  }
});

module.exports = router;
