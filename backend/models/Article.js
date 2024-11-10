const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  source: String,
  publishedAt: Date,
  url: String,
  urlToImage: String,
  category: String,
  tags: [String],
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Array of user IDs who liked the article
    },
  ],
  dislikedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Array of user IDs who disliked the article
    },
  ],
  comments: [CommentSchema], // Array of comments
});

module.exports = mongoose.model("Article", ArticleSchema);
