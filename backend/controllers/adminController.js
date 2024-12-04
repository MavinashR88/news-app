// backend/controllers/adminController.js

const User = require("../models/User");
const Article = require("../models/Article");
const Category = require("../models/Category");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  const { name, email, password, role, subscription } = req.body; // Include password here
  try {
    const newUser = new User({ name, email, password, role, subscription });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error.message); // Log detailed error
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to add user" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

// Add a new article
exports.addArticle = async (req, res) => {
  const { title, content, category, source } = req.body;

  // Validate required fields
  if (!title || !content || !category) {
    return res
      .status(400)
      .json({ message: "Title, content, and category are required." });
  }

  try {
    const newArticle = new Article({
      title,
      content,
      category,
      source,
    });

    await newArticle.save(); // Save the article to the database
    res.status(201).json(newArticle); // Return the saved article
  } catch (error) {
    console.error("Error adding article:", error.message);
    res.status(500).json({ message: "Failed to add article" });
  }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to add category" });
  }
};

// Get analytics data
exports.getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArticles = await Article.countDocuments();
    const totalViews = await Article.aggregate([
      { $group: { _id: null, total: { $sum: "$viewCount" } } },
    ]);

    res.json({
      totalUsers,
      totalArticles,
      totalViews: totalViews[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
};
