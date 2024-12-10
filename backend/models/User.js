const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true, // Ensuring the last name is required
  },
  DOB: {
    type: Date,
    required: true, // Ensuring the date of birth is required
  },
  phoneNumber: {
    type: String,
    required: true, // Ensuring the phone number is required
  },
  city: {
    type: String,
    required: true, // Ensuring the city is required
  },
  name: {
    type: String,
    required: true, // You can keep this field for backward compatibility
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
  readingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }], // References the articles the user has read
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }], // References the articles the user has saved
  subscription: {
    plan: {
      type: String,
      enum: ["free", "monthly", "yearly"],
      default: "free",
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
  },
  isBlocked: {
    type: Boolean,
    default: false, // By default, users are not blocked
  },
  passwordChangeRequired: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
