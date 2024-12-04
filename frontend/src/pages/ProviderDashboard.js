// ProviderDashboard.js
import React from "react";
import NewsFeed from "./NewsFeed";

const ProviderDashboard = () => {
  return (
    <div>
      <NewsFeed isProvider={true} />
    </div>
  );
};

export default ProviderDashboard;
