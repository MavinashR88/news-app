const Article = require("../models/Article");

// Create a new article
exports.createArticle = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const article = new Article({
      title,
      content,
      category,
      author: req.user.id,
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error.message);
    res.status(500).send("Server error");
  }
};

// Fetch all articles
exports.getAllArticles = async (req, res) => {
  console.log("Fetching all articles...");
  try {
    const articles = await Article.find().populate("author", "name");
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    res.status(500).send("Server error");
  }
};

// like
exports.likeArticle = async (req, res) => {
  const { userId } = req.body;
  const articleId = req.params.id;

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Remove `userId` from dislikedBy if it exists
    article.dislikedBy = article.dislikedBy.filter(
      (id) => id.toString() !== userId
    );

    if (article.likedBy.includes(userId)) {
      // Remove like
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== userId
      );
      article.likes -= 1;
    } else {
      // Add like
      article.likedBy.push(userId);
      article.likes += 1;
    }

    await article.save();
    res.json({ likes: article.likes, dislikes: article.dislikes });
  } catch (error) {
    console.error("Error liking article:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.dislike;

// Dislike
exports.likeArticle = async (req, res) => {
  const { userId } = req.body;
  const articleId = req.params.id;

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Remove `userId` from dislikedBy if it exists
    article.dislikedBy = article.dislikedBy.filter(
      (id) => id.toString() !== userId
    );

    if (article.likedBy.includes(userId)) {
      // Remove like
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== userId
      );
      article.likes -= 1;
    } else {
      // Add like
      article.likedBy.push(userId);
      article.likes += 1;
    }

    await article.save();
    res.json({ likes: article.likes, dislikes: article.dislikes });
  } catch (error) {
    console.error("Error liking article:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.dislike;
