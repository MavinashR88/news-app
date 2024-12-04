const axios = require("axios");
const Article = require("../models/Article");

// Define an array of categories to fetch data for
const categories = [
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
];

const fetchAndSaveNews = async () => {
  try {
    // Initialize an empty array to collect all articles
    let allArticles = [];

    // Loop through each category and fetch news articles
    for (const category of categories) {
      const response = await axios.get(
        `https://gnews.io/api/v4/top-headlines?token=82a8c8243574d1737db0c0b2feb4aeb4&lang=en&country=us&max=10&topic=${category}`
      );

      const articles = response.data.articles;

      const formattedArticles = articles.map((article) => ({
        title: article.title,
        content:
          article.description || article.content || "No content available.",
        author: article.author || "Unknown author",
        source: article.source.name,
        // publishedAt: article.publishedAt,
        publishedAt: new Date(article.publishedAt).toLocaleDateString("en-US"), // Extract date
        url: article.url,
        urlToImage: article.image,
        category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category
        tags: ["news", category, "headline", "latest"],
      }));

      // Append the formatted articles for this category to the main array
      allArticles = allArticles.concat(formattedArticles);
    }

    // Clear the collection and save all fetched data
    await Article.deleteMany({});
    await Article.insertMany(allArticles);

    // Log the number of documents after insertion
    const count = await Article.countDocuments();
    console.log(
      `News articles fetched and saved successfully. Count: ${count}`
    );
  } catch (error) {
    console.error("Error fetching and saving news:", error);
  }
};

module.exports = fetchAndSaveNews;
