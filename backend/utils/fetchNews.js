const axios = require("axios");
const Article = require("../models/Article");

const fetchAndSaveNews = async () => {
  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/top-headlines?token=82a8c8243574d1737db0c0b2feb4aeb4&lang=en&country=us&max=10`
    );
    const articles = response.data.articles;

    const formattedArticles = articles.map((article) => ({
      title: article.title,
      content:
        article.description || article.content || "No content available.",
      author: article.author || "Unknown author",
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url,
      urlToImage: article.image,
      category: "General",
      tags: ["news", "headline", "latest"],
    }));

    // Clear the collection and save new data
    await Article.deleteMany({});
    await Article.insertMany(formattedArticles);

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
