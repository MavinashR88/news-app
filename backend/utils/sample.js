require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const fs = require("fs");
const Article = require("../models/Article"); // Import your existing Article model

// MongoDB Connection
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://Avi_Tech:2001@cluster0.dldkq.mongodb.net/test?retryWrites=true&w=majority";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// Load JSON Data
const data = JSON.parse(fs.readFileSync("sample_articles.json", "utf-8"));

// Format Data with Valid ObjectIds
const formattedData = data.map((article) => ({
  ...article,
  author: new mongoose.Types.ObjectId(), // Generate ObjectId for author
  category: new mongoose.Types.ObjectId(), // Generate ObjectId for category
  comments: article.comments.map((comment) => ({
    ...comment,
    user: new mongoose.Types.ObjectId(), // Generate ObjectId for user
  })),
}));

// Save Data to MongoDB
const saveData = async () => {
  try {
    await Article.insertMany(formattedData); // Use the Article model to insert data
    console.log("Data saved successfully!");
    mongoose.connection.close(); // Close the connection
  } catch (error) {
    console.error("Error saving data:", error.message);
    mongoose.connection.close(); // Close the connection
  }
};

// Call the save function
saveData();
