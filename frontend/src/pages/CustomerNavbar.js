import React, { useState } from "react";
import "./CustomerNavbar.css";

const CustomerNavbar = ({ onCategoryChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const categories = [
    "All",
    "Business",
    "Sports",
    "Technology",
    "Entertainment",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSearchTerm(""); // Clear search input after submitting
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
        <a href="/profile">Profile</a>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
