import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerNavbar.css";

const CustomerNavbar = ({ onCategoryChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    "All",
    "Business",
    "Sports",
    "Technology",
    "Entertainment",
  ];

  // Fetch the user role
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/auth/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAddArticleClick = () => {
    navigate("/add-article");
  };

  if (loading) {
    // Ensure the navbar doesn't break during role loading
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">NewsApp</div>

      <div className="navbar-categories">
        {categories.map((category) => (
          <button key={category} onClick={() => onCategoryChange(category)}>
            {category}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles..."
        />
        <button type="submit">Search</button>
      </form>

      {userRole === "provider" && (
        <div className="provider-options">
          <button
            className="add-article-button"
            onClick={handleAddArticleClick}
          >
            Add Article
          </button>
        </div>
      )}

      <div className="navbar-profile">
        <button onClick={handleProfileClick}>Profile</button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
