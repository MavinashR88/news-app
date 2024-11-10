import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerNavbar from "./CustomerNavbar";
import NewsPop from "./NewsPop";
import "./NewsFeed.css";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isGridView, setIsGridView] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/articles");
        setArticles(res.data);
        setFilteredArticles(res.data); // Initially, all articles are displayed
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // Function to open NewsPop with selected article
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  // Function to handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsGridView(category !== "All"); // Grid view for specific categories, reset for "All"
    if (category === "All") {
      setFilteredArticles(articles); // Reset to all articles
    } else {
      filterArticles(category, "");
    }
  };

  // Function to handle search input
  const handleSearch = (term) => {
    setIsGridView(true); // Display search results in grid view
    filterArticles(selectedCategory, term);
  };

  // Function to filter articles based on category and search term
  const filterArticles = (category, term) => {
    const filtered = articles.filter((article) => {
      const matchesCategory =
        category === "All" || article.category === category;
      const matchesSearch = article.title
        .toLowerCase()
        .includes(term.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredArticles(filtered);
  };

  return (
    <div className="newsfeed-container">
      {/* Customer Navbar with category and search functionality */}
      <CustomerNavbar
        onCategoryChange={handleCategoryChange}
        onSearch={(term) => {
          handleSearch(term);
        }}
      />

      {isGridView ? (
        // Simple Grid Layout for filtered articles
        <section className="grid-layout">
          <h2>
            {selectedCategory === "All"
              ? "News Feed"
              : `${selectedCategory} Articles`}
          </h2>
          <div className="grid-container">
            {filteredArticles.map((article) => (
              <div
                key={article._id}
                className="grid-card"
                onClick={() => handleArticleClick(article)}
              >
                <img src={article.urlToImage} alt={article.title} />
                <h3>{article.title}</h3>
                <p>{article.content.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        // Original News Feed Layout for "All" selection
        <>
          <section className="top-news-section">
            <h2>Top News</h2>
            <div className="top-news-scroll">
              {filteredArticles.slice(0, 5).map((article) => (
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

          <section className="latest-news-section">
            <h2>Latest News</h2>
            <div className="latest-news-scroll">
              {filteredArticles.slice(0, 10).map((article) => (
                <div
                  key={article._id}
                  className="latest-news-card"
                  onClick={() => handleArticleClick(article)}
                >
                  <img src={article.urlToImage} alt={article.title} />
                  <h3>{article.title}</h3>
                  <p>{article.content.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Display the NewsPop modal */}
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
