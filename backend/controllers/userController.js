const User = require("../models/User");

// Get user profile
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

// Save an article to user's saved articles
exports.saveArticle = async (req, res) => {
  const { articleId } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user.savedArticles.includes(articleId)) {
      user.savedArticles.push(articleId);
      await user.save();
    }
    res.json(user.savedArticles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark article as read
exports.markAsRead = async (req, res) => {
  const { articleId } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user.readingHistory.includes(articleId)) {
      user.readingHistory.push(articleId);
      await user.save();
    }
    res.json(user.readingHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reading history for the user
exports.getReadingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "readingHistory"
    );
    res.json(user.readingHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get saved articles for the user
exports.getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("savedArticles");
    res.json(user.savedArticles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.subscription = subscription;
    await user.save();

    res.status(200).json({
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
