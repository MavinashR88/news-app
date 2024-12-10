const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique tag name
  relatedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }], // Articles linked to this tag
});

module.exports = mongoose.model("Tags", TagSchema);
