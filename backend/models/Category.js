const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique category name
  description: { type: String }, // Optional description
  createdDate: { type: Date, default: Date.now }, // Auto-set creation date
});

module.exports = mongoose.model("Categories", CategorySchema);
