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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        const allArticles = response.data || [];
        setArticles(allArticles);
        setFilteredArticles(allArticles);

        // Categorize articles
        const sortedByViews = [...allArticles].sort(
          (a, b) => b.viewCount - a.viewCount
        );
        setPopularArticles(sortedByViews.slice(0, 10));
        setLatestArticles(allArticles.slice(0, 10));
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
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = async (article) => {
    setSelectedArticle(article);

    try {
      // Increment the article's view count
      const updatedViewCount = article.viewCount + 1;
      await axios.post(
        `http://localhost:5000/api/articles/${article._id}/update`,
        { viewCount: updatedViewCount }
      );

      // Save the article in the user's read history
      const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage
      await axios.post("http://localhost:5000/api/user/history", {
        userId,
        articleId: article._id,
      });

      console.log("Article view count incremented and saved in read history.");
    } catch (error) {
      console.error(
        "Error updating article data:",
        error.response?.data || error.message
      );
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsGridView(true);

    if (category === "All") {
      setIsGridView(false);
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.category &&
          article.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredArticles(filtered);
    }
  };

  const renderTwoColumnLayout = (title, featuredArticle, sideArticles) => {
    if (!featuredArticle || !sideArticles) return null;

    return (
      <section className="two-column-section">
        <h2>{title}</h2>
        <div className="two-column-layout">
          {/* Featured Article */}
          {featuredArticle && (
            <div
              className="featured-article"
              onClick={() => handleArticleClick(featuredArticle)}
            >
              <img
                src={featuredArticle.urlToImage}
                alt={featuredArticle.title}
              />
              <h3>{featuredArticle.title}</h3>
              <p>
                {featuredArticle.content?.slice(0, 150) ||
                  "No content available"}
                ...
              </p>
              <div className="extra-details">
                <span>Source: {featuredArticle.source || "Unknown"}</span>
                <span>
                  Date: {new Date(featuredArticle.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Side Articles */}
          <div className="side-articles">
            {sideArticles.map((article) => (
              <div
                key={article._id}
                className="side-article"
                onClick={() => handleArticleClick(article)}
              >
                <img src={article.urlToImage} alt={article.title} />
                <div>
                  <h4>{article.title}</h4>
                  <p>{article.source || "Unknown Source"}</p>
                  <p className="details">
                    Published: {new Date(article.date).toLocaleDateString()}
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
              <img src={article.urlToImage} alt={article.title} />
              <div className="article-card-details">
                <h3>{article.title}</h3>
                <p>{article.source || "Unknown Source"}</p>
                <p>{new Date(article.date).toLocaleDateString()}</p>
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
              <img src={article.urlToImage} alt={article.title} />
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
        />
      )}
    </div>
  );
};

export default NewsFeed;
