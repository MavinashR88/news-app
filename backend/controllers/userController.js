// backend/controllers/userController.js
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Access user ID from verified token
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription || "Free",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reading history
exports.getReadingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "readingHistory"
    );
    res.json(user.readingHistory);
  } catch (error) {
    console.error("Error fetching reading history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get saved articles
exports.getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("savedArticles");
    res.json(user.savedArticles);
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const userId = req.userId; // This is set in authMiddleware
    const { subscription } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the subscription and save
    user.subscription = subscription;
    await user.save();

    res
      .status(200)
      .json({
        message: "Subscription updated successfully",
        subscription: user.subscription,
      });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res
      .status(500)
      .json({ message: "Failed to update subscription. Try again." });
  }
};
