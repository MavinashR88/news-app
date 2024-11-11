import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [readingHistory, setReadingHistory] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState("");

  const token = localStorage.getItem("authToken");

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
        setSubscriptionDetails(response.data.subscription);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle edit profile form
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Fetch reading history
  useEffect(() => {
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
    fetchReadingHistory();
  }, [token]);

  // Fetch saved articles
  useEffect(() => {
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
    fetchSavedArticles();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>

      {!isEditing ? (
        <div>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Subscription:</strong> {subscriptionDetails || "Free"}
          </p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <button onClick={handleUpdateProfile}>Save Changes</button>
        </div>
      )}

      <h3>Reading History</h3>
      {readingHistory.length > 0 ? (
        <ul>
          {readingHistory.map((article, index) => (
            <li key={index}>{article.title}</li>
          ))}
        </ul>
      ) : (
        <p>No reading history available.</p>
      )}

      <h3>Saved Articles</h3>
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
  );
};

export default Profile;
