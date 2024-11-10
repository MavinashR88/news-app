import React from "react";
import { Link } from "react-router-dom";

function ProviderDashboard() {
  return (
    <div>
      <nav>
        <Link to="/provider/home">Home</Link>
        <Link to="/provider/add-article">Add Article</Link>
        <Link to="/provider/manage-articles">Manage Articles</Link>
        <Link to="/newsfeed">NewsFeed</Link>
      </nav>
      <h1>Provider Dashboard</h1>
      {/* Add provider-specific content here */}
    </div>
  );
}

export default ProviderDashboard;
