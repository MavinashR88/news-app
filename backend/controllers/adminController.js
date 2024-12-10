// backend/controllers/adminController.js

const User = require("../models/User");
const Article = require("../models/Article");
const Category = require("../models/Category");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Tag = require("../models/Tags");
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
  const { name, email, password, role, subscription } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer", // Default role is "customer"
      subscription: subscription || "Free", // Default subscription is "Free"
      passwordChangeRequired: true,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the newly created user (excluding the password)
    res.status(201).json({
      message: "User added successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error adding user:", error.message);

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // Generic server error response
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
  try {
    const { title, content, category, tags, source, picture, author } =
      req.body;
    const adminId = req.user._id; // Assume req.user contains the current logged-in user (admin).

    // Normalize author name
    const normalizedAuthor = author?.trim().toLowerCase();

    // Validate or create author
    let user = null;
    if (normalizedAuthor) {
      user = await User.findOne({
        name: { $regex: new RegExp(`^${normalizedAuthor}$`, "i") }, // Case-insensitive match
      });

      if (!user) {
        console.log(
          `Author not found, creating a new one: ${normalizedAuthor}`
        );
        user = new User({
          name: author,
          role: "provider", // Default role for new authors
          addedBy: adminId, // Associate the author with the admin who added them
        });
        await user.save();
      }
    } else {
      console.log("No author provided, assigning current admin as author.");
      user = await User.findById(adminId);
    }

    // Validate or create category
    let categoryDoc = await Category.findOne({ name: category.trim() });
    if (!categoryDoc) {
      console.log(`Category not found, creating a new one: ${category}`);
      categoryDoc = new Category({ name: category.trim() });
      await categoryDoc.save();
    }

    // Validate or create tags
    const tagNames = Array.isArray(tags)
      ? tags
      : tags.split(",").map((tag) => tag.trim());
    const tagIds = [];
    for (const tagName of tagNames) {
      let tagDoc = await Tag.findOne({ name: tagName });
      if (!tagDoc) {
        console.log(`Tag not found, creating a new one: ${tagName}`);
        tagDoc = new Tag({ name: tagName });
        await tagDoc.save();
      }
      tagIds.push(tagDoc._id);
    }

    // Create the article
    const newArticle = new Article({
      title,
      content,
      author: user._id, // Use ObjectId
      category: categoryDoc._id, // Use ObjectId
      tags: tagIds, // Use ObjectId array
      source,
      picture,
      publishedDate: Date.now(),
    });

    await newArticle.save();
    console.log("Article successfully created:", newArticle);

    res.status(201).json({ message: "Article added successfully", newArticle });
  } catch (error) {
    console.error("Error adding article:", error);
    res
      .status(500)
      .json({ message: "Failed to add article", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    console.log("Category creation request received with body:", req.body);

    const { name, description } = req.body;

    if (!name) {
      console.log("Category name missing");
      return res.status(400).json({ message: "Category name is required." });
    }

    let category = await Category.findOne({ name: name.trim() });
    console.log("Existing category lookup result:", category);

    if (category) {
      return res
        .status(200)
        .json({ message: "Category already exists.", category });
    }

    category = new Category({ name: name.trim(), description });
    await category.save();
    console.log("Category successfully created:", category);

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
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
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    console.log("Total Views Aggregation Result:", totalViews);
    res.json({
      totalUsers,
      totalArticles,
      totalViews: totalViews[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
};
