import React, { useState, useEffect } from "react";
import axios from "axios";
import NewsPop from "./NewsPop";
import CustomerNavbar from "./CustomerNavbar";
import "./NewsFeed.css";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isGridView, setIsGridView] = useState(false);

  const [popularArticles, setPopularArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [cnnArticles, setCnnArticles] = useState([]);
  const [generalArticles, setGeneralArticles] = useState([]);
  const [androidCentralArticles, setAndroidCentralArticles] = useState([]);
  const [gizmodoArticles, setGizmodoArticles] = useState([]);
  const [vergeArticles, setVergeArticles] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  // Fetch all articles on load
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log("Fetching all articles...");
        const response = await axios.get("http://localhost:5000/api/articles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allArticles = response.data || [];
        setArticles(allArticles);
        setFilteredArticles(allArticles);
        categorizeArticles(allArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [token]);

  // Categorize articles
  const categorizeArticles = (allArticles) => {
    if (!allArticles || allArticles.length === 0) return;

    // Latest Articles: Sort by publishedDate in descending order
    const latestSorted = [...allArticles].sort(
      (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
    );
    setLatestArticles(latestSorted.slice(0, 10)); // Top 10 latest articles

    // Popular Articles: Sort by likes in descending order
    const popularSorted = [...allArticles].sort(
      (a, b) => b.likes - a.likes // Sorting by likes
    );
    setPopularArticles(popularSorted.slice(0, 10)); // Top 10 popular articles

    // Categorizing based on sources (CNN, General, etc.)
    setCnnArticles(
      allArticles.filter((article) => article.source === "CNN").slice(0, 10)
    );
    setGeneralArticles(allArticles.slice(0, 10));
    setAndroidCentralArticles(
      allArticles
        .filter((article) => article.source === "Android Central")
        .slice(0, 10)
    );
    setGizmodoArticles(
      allArticles
        .filter((article) => article.source === "Gizmodo.com")
        .slice(0, 10)
    );
    setVergeArticles(
      allArticles
        .filter((article) => article.source === "The Verge")
        .slice(0, 10)
    );
  };

  // Handle article click
  const handleArticleClick = async (article) => {
    setSelectedArticle(article);
    try {
      await axios.post(
        `http://localhost:5000/api/users/${userId}/mark-read`,
        { articleId: article._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Article ${article._id} marked as read.`);
    } catch (error) {
      console.error(
        "Error marking article as read:",
        error.response?.data || error.message
      );
      alert("Failed to update article data.");
    }
  };

  // Handle category change
  const handleCategoryChange = async (category) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    setIsGridView(true);

    if (category === "All") {
      setIsGridView(false);
      setFilteredArticles(articles);
    } else {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/articles/search",
          { params: { category } }
        );
        setFilteredArticles(response.data);
      } catch (error) {
        console.error("Error filtering articles by category:", error);
      }
    }
  };

  // Render layouts
  const renderTwoColumnLayout = (title, featuredArticle, sideArticles) => {
    if (!featuredArticle || !sideArticles) return null;

    return (
      <section className="two-column-section">
        <h2>{title}</h2>
        <div className="two-column-layout">
          <div
            className="featured-article"
            onClick={() => handleArticleClick(featuredArticle)}
          >
            <img
              src={featuredArticle.picture || "placeholder.jpg"}
              alt={featuredArticle.title}
            />
            <h3>{featuredArticle.title}</h3>
            <p>
              {featuredArticle.content?.slice(0, 150) || "No content available"}
              ...
            </p>
            <div className="extra-details">
              <span>Source: {featuredArticle.source || "Unknown"}</span>
              <span>
                Date:{" "}
                {new Date(featuredArticle.publishedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="side-articles">
            {sideArticles.map((article) => (
              <div
                key={article._id}
                className="side-article"
                onClick={() => handleArticleClick(article)}
              >
                <img
                  src={article.picture || "placeholder.jpg"}
                  alt={article.title}
                />
                <div>
                  <h4>{article.title}</h4>
                  <p>{article.source || "Unknown Source"}</p>
                  <p className="details">
                    Published:{" "}
                    {new Date(article.publishedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderHorizontalSlider = (title, articles) => {
    if (!articles || articles.length === 0) return null;

    return (
      <section className="horizontal-slider-section">
        <h2>{title}</h2>
        <div className="horizontal-slider">
          {articles.map((article) => (
            <div
              key={article._id}
              className="article-card"
              onClick={() => handleArticleClick(article)}
            >
              <img
                src={article.picture || "placeholder.jpg"}
                alt={article.title}
              />
              <div className="article-card-details">
                <h3>{article.title}</h3>
                <p>{article.source || "Unknown Source"}</p>
                <p>{new Date(article.publishedDate).toLocaleDateString()}</p>
                <p>
                  {article.content?.slice(0, 100) || "No content available"}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderGridLayout = (title, articles) => {
    return (
      <section className="grid-layout-section">
        <h2>{title}</h2>
        <div className="grid-container">
          {articles.map((article) => (
            <div
              key={article._id}
              className="grid-card"
              onClick={() => handleArticleClick(article)}
            >
              <img
                src={article.picture || "placeholder.jpg"}
                alt={article.title}
              />
              <h3>{article.title}</h3>
              <p>
                {article.content?.slice(0, 100) || "No content available"}...
              </p>
              <span>Source: {article.source || "Unknown Source"}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="newsfeed-container">
      <CustomerNavbar
        onCategoryChange={handleCategoryChange}
        onHomeClick={() => {
          setSelectedCategory("All");
          setFilteredArticles(articles);
          setIsGridView(false);
        }}
      />

      {isGridView ? (
        renderGridLayout(`${selectedCategory} News`, filteredArticles)
      ) : (
        <>
          {renderTwoColumnLayout(
            "Popular News",
            popularArticles[0],
            popularArticles.slice(1, 6)
          )}
          {renderHorizontalSlider("Latest News", latestArticles)}
          {renderTwoColumnLayout(
            "CNN News",
            cnnArticles[0],
            cnnArticles.slice(1, 6)
          )}
          {renderHorizontalSlider("General News", generalArticles)}
          {renderTwoColumnLayout(
            "Android Central News",
            androidCentralArticles[0],
            androidCentralArticles.slice(1, 6)
          )}
          {renderHorizontalSlider("Gizmodo News", gizmodoArticles)}
          {renderTwoColumnLayout(
            "The Verge News",
            vergeArticles[0],
            vergeArticles.slice(1, 6)
          )}
        </>
      )}

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
