const Article = require("../models/Article");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Category = require("../models/Category");
const Tag = require("../models/Tags");

const mongoose = require("mongoose"); // Add this import if missing

// --- Article Operations ---

// Fetch all articles or filter by category
exports.getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;

    const query = category && category !== "All" ? { category } : {};
    const articles = await Article.find(query).populate("author", "name");

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
};

/**
 * Like an article
 * - Allows a user to like an article only once.
 */
// exports.likeArticle = async (req, res) => {
//   const { articleId, userId } = req.body;

//   if (!articleId || !userId) {
//     console.error("Missing articleId or userId");
//     return res.status(400).json({ error: "Missing articleId or userId" });
//   }

//   try {
//     const article = await Article.findById(articleId);
//     if (!article) {
//       console.error("Article not found");
//       return res.status(404).json({ error: "Article not found" });
//     }

//     if (!article.likedBy) article.likedBy = [];
//     if (article.likedBy.includes(userId)) {
//       return res
//         .status(400)
//         .json({ error: "You have already liked this article" });
//     }

//     // Add user to likedBy array
//     article.likedBy.push(userId);

//     // Remove from dislikedBy if present
//     article.dislikedBy = article.dislikedBy.filter(
//       (id) => id.toString() !== userId
//     );

//     await article.save();

//     res.status(200).json({
//       message: "Article liked successfully",
//       likes: article.likedBy.length,
//       dislikes: article.dislikedBy.length,
//     });
//   } catch (error) {
//     console.error("Error in likeArticle:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while liking the article" });
//   }
// };

exports.likeArticle = async (req, res) => {
  const { articleId, userId } = req.body;

  if (!articleId || !userId) {
    console.error("Missing articleId or userId");
    return res.status(400).json({ error: "Missing articleId or userId" });
  }

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      console.error("Article not found");
      return res.status(404).json({ error: "Article not found" });
    }

    if (!article.likedBy) article.likedBy = [];
    if (article.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already liked this article" });
    }

    // Add user to likedBy array
    article.likedBy.push(userId);

    // Remove from dislikedBy if present
    article.dislikedBy = article.dislikedBy.filter(
      (id) => id.toString() !== userId
    );

    await article.save();

    res.status(200).json({
      message: "Article liked successfully",
      likes: article.likedBy.length,
      dislikes: article.dislikedBy.length,
    });
  } catch (error) {
    console.error("Error in likeArticle:", error);
    res
      .status(500)
      .json({ error: "An error occurred while liking the article" });
  }
};

exports.dislikeArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { userId } = req.body;

    console.log("Dislike Request:", { articleId, userId });

    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (!article.dislikedBy.includes(userId)) {
      article.dislikedBy.push(userId);
      article.likedBy = article.likedBy.filter(
        (id) => id.toString() !== userId
      ); // Remove from likedBy if present
    } else {
      return res
        .status(400)
        .json({ message: "You already disliked this article" });
    }

    await article.save();
    res.status(200).json({
      likes: article.likedBy.length,
      dislikes: article.dislikedBy.length,
    });
  } catch (error) {
    console.error("Error in dislikeArticle:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// exports.dislikeArticle = async (req, res) => {
//   try {
//     const { articleId } = req.params;
//     const { userId } = req.body;

//     console.log("Dislike Request:", { articleId, userId }); // Debugging logs

//     const article = await Article.findById(articleId);
//     if (!article) return res.status(404).json({ message: "Article not found" });

//     if (!article.dislikedBy.includes(userId)) {
//       article.dislikedBy.push(userId);
//       article.likedBy = article.likedBy.filter(
//         (id) => id.toString() !== userId
//       ); // Remove from likedBy if present
//     } else {
//       return res
//         .status(400)
//         .json({ message: "You already disliked this article" });
//     }

//     await article.save();
//     res.status(200).json({ dislikes: article.dislikedBy.length });
//   } catch (error) {
//     console.error("Error in dislikeArticle:", error);
//     res.status(500).json({ message: "An error occurred" });
//   }
// };

/**
 * Add a comment to an article
 */
exports.addComment = async (req, res) => {
  const { articleId } = req.params;
  const { userId, text } = req.body;

  console.log("Incoming request body:", req.body); // Log the request body to inspect
  console.log("Article ID:", articleId); // Log the articleId to inspect
  console.log("User ID:", userId); // Log the userId to inspect
  console.log("Comment Text:", text); // Log the comment text to inspect

  // Validate that all required fields are provided
  if (!userId || !text || !articleId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      articleId,
      userId,
      text,
    });

    await newComment.save();

    // Push the new comment into the article's comment array
    article.comments.push(newComment);
    await article.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

exports.fetchComments = async (req, res) => {
  const { articleId } = req.params;

  try {
    if (!articleId) {
      return res.status(400).json({ message: "Article ID is required" });
    }

    // Fetch the latest 5 comments for the article, sorted by creation time
    const comments = await Comment.find({ articleId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name avatar");

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error in fetchComments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// --- User Operations ---

/**
 * Get user profile
 */
/**
 * Get user profile
 */
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  console.log("Received userId:", userId); // Debugging

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

/**
 * Update user profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body; // Expected to have 'name' and 'email' fields.

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // Return the updated document
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

/**
 * Save an article to user's saved articles
 */
exports.saveArticle = async (req, res) => {
  try {
    const { userId, articleId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedArticles: articleId } }, // Avoid duplicates
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Article saved successfully",
      savedArticles: user.savedArticles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving article", error });
  }
};

/**
 * Mark an article as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const { articleId } = req.body;

    // Find the article and increment view count in one query
    const article = await Article.findByIdAndUpdate(
      articleId,
      { $inc: { views: 1 } }, // Increment the views field
      { new: true } // Return the updated document
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add to reading history if not already present
    if (!user.readingHistory.includes(articleId)) {
      user.readingHistory.push(articleId);
      await user.save();
    }

    res.status(200).json({
      message: "Article marked as read successfully",
      viewCount: article.views, // Return the updated view count
    });
  } catch (error) {
    console.error("Error marking article as read:", error);
    res.status(500).json({ message: "Failed to mark article as read" });
  }
};

/**
 * Get user's reading history
 */
exports.getReadingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "readingHistory"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ readingHistory: user.readingHistory });
  } catch (error) {
    console.error("Error fetching reading history:", error);
    res.status(500).json({ message: "Failed to fetch reading history" });
  }
};

exports.getSavedArticles = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user and populate savedArticles
    const user = await User.findById(userId).populate("savedArticles");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the saved articles
    res.status(200).json({ savedArticles: user.savedArticles });
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    res.status(500).json({ message: "Failed to fetch saved articles", error });
  }
};

/**
 * Update subscription
 */
const downgradeExpiredSubscriptions = async (user) => {
  const currentDate = new Date();

  // Check if subscription has expired
  if (user.subscription.isActive && user.subscription.endDate < currentDate) {
    user.subscription = {
      plan: "free",
      isActive: false,
      startDate: null,
      endDate: null,
    };

    await user.save(); // Save changes to the database
    console.log(`User ${user.name}'s subscription downgraded to free.`);
  }
};

// Update Subscription API
exports.updateSubscription = async (req, res) => {
  console.log("Starting updateSubscription API...");
  try {
    const { plan } = req.body;
    const userId = req.params.userId;

    console.log("Received userId:", userId);
    console.log("Received plan:", plan);

    if (!plan || !userId) {
      console.error("Missing required fields: plan or userId.");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.name);

    // Downgrade expired subscriptions if applicable
    await downgradeExpiredSubscriptions(user);

    const currentDate = new Date();
    let endDate;

    if (plan === "monthly") {
      endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    } else if (plan === "yearly") {
      endDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      );
    } else if (plan === "free") {
      endDate = null;
    } else {
      console.error("Invalid subscription plan:", plan);
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    console.log("Calculated endDate:", endDate);

    user.subscription = {
      plan,
      startDate: plan === "free" ? null : currentDate,
      endDate,
      isActive: plan !== "free",
    };

    await user.save();
    console.log("User subscription updated successfully:", user.subscription);

    res.status(200).json({ subscription: user.subscription });
  } catch (error) {
    console.error("Error updating subscription:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch articles by author (provider)
exports.getPublishedArticles = async (req, res) => {
  try {
    const { userId } = req.params; // Provider's user ID

    // Find all articles where the author matches the user ID and status is not "draft"
    const articles = await Article.find({
      author: userId,
      status: { $ne: "draft" }, // Exclude articles with status 'draft'
    }).populate("author", "name");

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No published articles found." });
    }

    res.status(200).json({ publishedArticles: articles });
  } catch (error) {
    console.error("Error fetching published articles:", error);
    res.status(500).json({ message: "Failed to fetch published articles." });
  }
};

exports.searchArticles = async (req, res) => {
  const { searchTerm, category } = req.query;

  try {
    // Build query
    const query = {};

    // Add search term filter
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
        { source: { $regex: searchTerm, $options: "i" } }, // Search by source
        { tags: { $regex: searchTerm, $options: "i" } }, // Search by tags
      ];
    }

    // Add category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Execute query
    const articles = await Article.find(query)
      .populate("author", "name")
      .populate("tags");

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error searching articles:", error);
    res.status(500).json({ message: "Failed to search articles" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received block/unblock request for userId:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    console.log(
      `Updated isBlocked to: ${user.isBlocked} for user: ${user.name}`
    );

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in blockUser:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Save article as draft
exports.saveAsDraft = async (req, res) => {
  const { title, content, category, source, tags, picture } = req.body;
  const userId = req.user.userId; // Get user ID from the token

  console.log("Request Body:", req.body);
  console.log("User ID:", userId);

  try {
    // Check if category exists and convert to ObjectId
    let categoryId;
    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        categoryId = categoryDoc._id; // Use the category ObjectId
      } else {
        return res.status(400).json({ message: "Category not found" });
      }
    }

    // Check if tags exist and convert to ObjectIds
    let tagIds = [];
    if (tags && Array.isArray(tags)) {
      tagIds = await Promise.all(
        tags.map(async (tagName) => {
          const tagDoc = await Tag.findOne({ name: tagName });
          return tagDoc ? tagDoc._id : null; // If tag exists, get its ObjectId
        })
      );
    }

    // Create a new article with status 'draft'
    const newArticle = new Article({
      title,
      content,
      category: categoryId, // Use category ObjectId
      source,
      tags: tagIds, // Use tag ObjectIds
      picture,
      author: userId, // Use userId from the token for the author
      addedBy: userId, // The user who is adding the article
      status: "draft", // Save the article as a draft
    });

    // Save the article to the database
    await newArticle.save();

    // Respond with the saved article
    res
      .status(201)
      .json({ message: "Article saved as draft", article: newArticle });
  } catch (error) {
    console.error("Error saving article as draft:", error);
    res.status(500).json({
      message: "Failed to save article as draft",
      error: error.message,
    });
  }
};

// Get all draft articles
exports.getDraftArticles = async (req, res) => {
  try {
    const { userId } = req.params; // Provider's user ID

    // Find all articles where the author matches the user ID and status is "draft"
    const drafts = await Article.find({
      author: userId,
      status: "draft", // Only fetch articles with status "draft"
    }).populate("author", "name");

    if (!drafts || drafts.length === 0) {
      return res.status(404).json({ message: "No draft articles found." });
    }

    res.status(200).json({ draftArticles: drafts });
  } catch (error) {
    console.error("Error fetching draft articles:", error);
    res.status(500).json({ message: "Failed to fetch draft articles." });
  }
};

// Controller: Update article status
// Controller to update article status
exports.updateArticleStatus = async (req, res) => {
  try {
    const { articleId } = req.params; // Get article ID
    const { status } = req.body; // New status, which will be 'published'

    // Find the article
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Update the status of the article
    article.status = status; // Set status to 'published'
    await article.save();

    res.status(200).json({ message: "Article status updated", article });
  } catch (error) {
    console.error("Error updating article status:", error);
    res
      .status(500)
      .json({ message: "Failed to update article", error: error.message });
  }
};
