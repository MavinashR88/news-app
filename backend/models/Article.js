const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // References the User collection
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  }, // References the Categories collection
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }], // References the Tags collection
  publishedDate: { type: Date, default: Date.now }, // Auto-set to current date
  views: { type: Number, default: 0 }, // Tracks article views
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who commented
      text: { type: String },
      timestamp: { type: Date, default: Date.now }, // Auto-set to comment time
    },
  ],
  source: { type: String, required: true }, // Article source, e.g., CNN
  picture: { type: String }, // Image URL
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["draft", "published"], default: "published" },
});

module.exports = mongoose.model("Article", ArticleSchema);
