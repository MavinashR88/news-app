require("dotenv").config(); // Load .env variables

const mongoose = require("mongoose");
const Article = require("./models/Article");
const User = require("./models/User");
const Category = require("./models/Category");
const Tag = require("./models/Tags");
const PublishedArticle = require("./models/Published");

// Verify if the MongoDB URI is loaded
if (!process.env.MONGODB_URI) {
  console.error("MongoDB URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Dummy data
const categoriesData = [
  { name: "Technology", description: "All about the latest in tech." },
  { name: "Business", description: "Business news and insights." },
];

const usersData = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "hashed_password",
    role: "customer",
    subscription: {
      plan: "monthly",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      isActive: true,
    },
  },
];

const insertTestData = async () => {
  try {
    await Category.deleteMany({});
    await User.deleteMany({});

    const categories = await Category.insertMany(categoriesData);
    console.log("Categories inserted:", categories);

    const users = await User.insertMany(usersData);
    console.log("Users inserted:", users);

    console.log("Test data inserted successfully!");
  } catch (error) {
    console.error("Error inserting test data:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertTestData();
