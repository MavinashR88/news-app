// backend/index.js
require("dotenv").config(); // Ensure this is the first line
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes"); // Admin user management routes
const adminArticleRoutes = require("./routes/adminArticleRoutes"); // Admin article management routes
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/user", userRoutes); // User routes for profile and other user-specific tasks
app.use("/api/articles", articleRoutes); // General article routes
app.use("/api/admin/users", adminUserRoutes); // Admin-specific user management routes
app.use("/api/admin/articles", adminArticleRoutes); // Admin-specific article management routes
app.use("/api/admin", adminRoutes);

// Test route for quick server checks
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route working" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
