import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; // Ensure this contains the necessary styling
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [readingHistory, setReadingHistory] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState("");
  const [showReadingHistory, setShowReadingHistory] = useState(false);
  const [showSavedArticles, setShowSavedArticles] = useState(false);
  const [showPublishedArticles, setShowPublishedArticles] = useState(false);
  const [userRole, setUserRole] = useState(""); // For checking the user role
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
        setSubscriptionDetails(response.data.subscription);
        setUserRole(response.data.role); // Save user role
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    const fetchReadingHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/reading-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReadingHistory(response.data);
      } catch (error) {
        console.error("Error fetching reading history:", error);
      }
    };

    const fetchSavedArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/saved-articles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSavedArticles(response.data);
      } catch (error) {
        console.error("Error fetching saved articles:", error);
      }
    };

    const fetchPublishedArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/provider/published-articles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPublishedArticles(response.data);
      } catch (error) {
        console.error("Error fetching published articles:", error);
      }
    };

    fetchProfile();
    fetchReadingHistory();
    fetchSavedArticles();

    if (userRole === "provider") {
      fetchPublishedArticles();
    }
  }, [token, userRole]);

  const handleEdit = () => setIsEditing(true);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddArticleClick = () => {
    navigate("/add-article"); // Redirect to add article page
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Details</h2>
        {!isEditing ? (
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Subscription:</strong> {subscriptionDetails || "Free"}
            </p>
            <button onClick={handleEdit} className="edit-button">
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="edit-profile-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="input-field"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="input-field"
            />
            <button onClick={handleUpdateProfile} className="save-button">
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Add Article Button for Providers */}
      {userRole === "provider" && (
        <div className="add-article-section">
          <button
            onClick={handleAddArticleClick}
            className="add-article-button"
          >
            Add Article
          </button>
        </div>
      )}

      <div className="history-card">
        <h3 onClick={() => setShowReadingHistory(!showReadingHistory)}>
          Reading History {showReadingHistory ? "▲" : "▼"}
        </h3>
        {showReadingHistory && (
          <div>
            {readingHistory.length > 0 ? (
              <ul>
                {readingHistory.map((article, index) => (
                  <li key={index}>{article.title}</li>
                ))}
              </ul>
            ) : (
              <p>No reading history available.</p>
            )}
          </div>
        )}
      </div>

      <div className="history-card">
        <h3 onClick={() => setShowSavedArticles(!showSavedArticles)}>
          Saved Articles {showSavedArticles ? "▲" : "▼"}
        </h3>
        {showSavedArticles && (
          <div>
            {savedArticles.length > 0 ? (
              <ul>
                {savedArticles.map((article, index) => (
                  <li key={index}>{article.title}</li>
                ))}
              </ul>
            ) : (
              <p>No saved articles available.</p>
            )}
          </div>
        )}
      </div>

      {/* Published Articles Section for Providers */}
      {userRole === "provider" && (
        <div className="history-card">
          <h3 onClick={() => setShowPublishedArticles(!showPublishedArticles)}>
            Published Articles {showPublishedArticles ? "▲" : "▼"}
          </h3>
          {showPublishedArticles && (
            <div>
              {publishedArticles.length > 0 ? (
                <ul>
                  {publishedArticles.map((article, index) => (
                    <li key={index}>{article.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No published articles available.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
