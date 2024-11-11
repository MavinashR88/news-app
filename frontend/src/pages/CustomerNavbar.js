import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerNavbar.css";

const CustomerNavbar = ({ onCategoryChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Business",
    "Sports",
    "Technology",
    "Entertainment",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm); // Ensure onSearch is defined before calling it
    }
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Directly navigate to the profile page
  };

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

      <div className="navbar-profile">
        <button onClick={handleProfileClick}>Profile</button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
