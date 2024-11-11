const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
});

module.exports = mongoose.model("User", UserSchema);
