import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerNavbar from "./CustomerNavbar";
import NewsPop from "./NewsPop";
import "./NewsFeed.css";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [topArticles, setTopArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [sourceFilteredArticles, setSourceFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("");
  const [isGridView, setIsGridView] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const userId = localStorage.getItem("userId"); // Retrieve user ID from localStorage

  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/articles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArticles(res.data);

        // Filter sections
        setTopArticles(res.data.slice(0, 5)); // Assuming top articles are the first 5 for simplicity
        setPopularArticles(
          res.data.sort((a, b) => b.likes - a.likes).slice(0, 5)
        ); // Most liked articles as popular
        setLatestArticles(
          res.data.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
          )
        ); // Latest articles based on published date
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [token]);

  const handleArticleClick = (article) => {
    markAsRead(article._id);
    setSelectedArticle(article);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsGridView(category !== "All");
    if (category === "All") {
      setSourceFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) => article.category === category
      );
      setSourceFilteredArticles(filtered);
    }
  };

  const handleSourceChange = (source) => {
    setSelectedSource(source);
    const filteredBySource = articles.filter(
      (article) => article.source === source
    );
    setSourceFilteredArticles(filteredBySource);
  };

  const saveArticle = async (articleId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/save-article",
        { userId, articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Article saved successfully!");
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const markAsRead = async (articleId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/mark-as-read",
        { userId, articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Article marked as read!");
    } catch (error) {
      console.error("Error marking article as read:", error);
    }
  };

  return (
    <div className="newsfeed-container">
      <CustomerNavbar
        onCategoryChange={handleCategoryChange}
        onSourceChange={handleSourceChange}
      />

      {/* Top News Section */}
      <section className="top-news-section">
        <h2>Top News</h2>
        <div className="top-news-scroll">
          {topArticles.map((article) => (
            <div
              key={article._id}
              className="top-news-card"
              onClick={() => handleArticleClick(article)}
            >
              <img src={article.urlToImage} alt={article.title} />
              <h3>{article.title}</h3>
              <p>{article.content.slice(0, 80)}...</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Articles Section */}
      <section className="popular-articles-section">
        <h2>Popular Articles</h2>
        <div className="grid-container">
          {popularArticles.map((article) => (
            <div
              key={article._id}
              className="grid-card"
              onClick={() => handleArticleClick(article)}
            >
              <img src={article.urlToImage} alt={article.title} />
              <h3>{article.title}</h3>
              <p>{article.content.slice(0, 100)}...</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveArticle(article._id);
                }}
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="latest-news-section">
        <h2>Latest News</h2>
        <div className="grid-container">
          {latestArticles.slice(0, 5).map((article) => (
            <div
              key={article._id}
              className="grid-card"
              onClick={() => handleArticleClick(article)}
            >
              <img src={article.urlToImage} alt={article.title} />
              <h3>{article.title}</h3>
              <p>{article.content.slice(0, 100)}...</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveArticle(article._id);
                }}
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Filtered by Source Section */}
      {selectedSource && (
        <section className="source-filtered-section">
          <h2>{selectedSource} News</h2>
          <div className="grid-container">
            {sourceFilteredArticles.map((article) => (
              <div
                key={article._id}
                className="grid-card"
                onClick={() => handleArticleClick(article)}
              >
                <img src={article.urlToImage} alt={article.title} />
                <h3>{article.title}</h3>
                <p>{article.content.slice(0, 100)}...</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveArticle(article._id);
                  }}
                >
                  Save
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Article Popup */}
      {selectedArticle && (
        <NewsPop
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default NewsFeed;
