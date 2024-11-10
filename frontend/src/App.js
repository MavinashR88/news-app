import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewsFeed from "./pages/NewsFeed";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/newsfeed" element={<NewsFeed />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/provider" element={<ProviderDashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
