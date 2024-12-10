const mongoose = require("mongoose");

const PublishedArticleSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // References the provider
  title: { type: String, required: true }, // Article title
  content: { type: String, required: true }, // Full article content
  publishedDate: { type: Date, default: Date.now }, // Auto-set to current date
  status: { type: String, enum: ["draft", "published"], default: "draft" }, // Article status
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Categories" }, // Article category
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }], // Article tags
});

module.exports = mongoose.model("PublishedArticles", PublishedArticleSchema);
