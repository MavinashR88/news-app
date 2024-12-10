require("dotenv").config(); // Ensure this is the first line
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Admin routes
const operationsRouter = require("./routes/operation_router");
const adminUserRoutes = require("./routes/adminUserRoutes"); // Admin user management routes
const adminArticleRoutes = require("./routes/adminArticleRoutes");

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/admin", adminRoutes); // Admin-specific routes
app.use("/api/admin/users", adminUserRoutes); // Admin-specific user management routes
app.use("/api/admin/articles", adminArticleRoutes); // Admin-specific article management routes
app.use("/api", operationsRouter); // General operation routes
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Root route to handle base URL
app.get("/", (req, res) => {
  res.send("Welcome to the News API Server! Navigate to /api for endpoints.");
});

// Test route for quick server checks
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route working" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
