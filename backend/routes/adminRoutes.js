const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyToken = require("../middlewares/authMiddleware"); // Middleware to verify the token
const checkAdmin = require("../middlewares/checkAdmin"); // Middleware to check if the user is an admin

// Use verifyToken and checkAdmin on all routes to restrict them to authenticated admins only
router.use(verifyToken, checkAdmin);

// User Management Routes
router.get("/users", adminController.getAllUsers); // Get all users
router.post("/users", adminController.addUser); // Add a new user
router.delete("/users/:id", adminController.deleteUser); // Delete a user by ID

// Article Management Routes
router.get("/articles", adminController.getAllArticles); // Get all articles
router.post("/articles", adminController.addArticle); // Add a new article
router.delete("/articles/:id", adminController.deleteArticle); // Delete an article by ID

// Category Management Routes
router.get("/categories", adminController.getAllCategories); // Get all categories
router.post("/categories", adminController.addCategory); // Add a new category

// Analytics Route
router.get("/analytics", adminController.getAnalyticsData); // Get analytics data

module.exports = router;
