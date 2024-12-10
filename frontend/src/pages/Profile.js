import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [subscriptionDetails, setSubscriptionDetails] = useState("");
  const [readingHistory, setReadingHistory] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [draftArticles, setDraftArticles] = useState([]);

  const [userRole, setUserRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdowns, setDropdowns] = useState({
    readingHistory: false,
    savedArticles: false,
    publishedArticles: false,
  });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(response.data);
        setSubscriptionDetails(response.data.subscription);
        setUserRole(response.data.role);

        const historyResponse = await axios.get(
          `http://localhost:5000/api/users/${userId}/reading-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReadingHistory(historyResponse.data.readingHistory || []);

        const savedResponse = await axios.get(
          `http://localhost:5000/api/users/${userId}/saved-articles`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavedArticles(savedResponse.data.savedArticles || []);

        if (response.data.role === "provider") {
          const publishedResponse = await axios.get(
            `http://localhost:5000/api/users/${userId}/published-articles`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPublishedArticles(publishedResponse.data.publishedArticles || []);

          // Fetch Draft Articles for providers
          const draftResponse = await axios.get(
            `http://localhost:5000/api/users/${userId}/draft-articles`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDraftArticles(draftResponse.data.draftArticles || []);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  const handleEdit = () => {
    setFormData({ name: userData.name, email: userData.email });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleConfirmSubscription = async () => {
    if (!selectedPlan) {
      alert("Please select a subscription plan.");
      return;
    }

    try {
      console.log("Updating subscription for:", userData._id);
      console.log("Selected plan:", selectedPlan);

      // Convert the plan to lowercase before sending
      const response = await axios.post(
        `http://localhost:5000/api/users/${userData._id}/update-subscription`,
        { plan: selectedPlan.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Subscription updated successfully!");
        setSubscriptionDetails(response.data.subscription);
        setShowUpgradeModal(false);
      }
    } catch (error) {
      console.error(
        "Error updating subscription:",
        error.response?.data || error.message
      );
      alert("Failed to update subscription. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userData._id}/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData((prevState) => ({
        ...prevState,
        name: response.data.name,
        email: response.data.email,
      }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishOrDelete = (article) => {
    const action = window.confirm(
      `Do you want to publish or delete the article "${article.title}"?`
    );

    if (action) {
      const publishOrDeleteAction = window.confirm(
        "Click OK to publish. Cancel to delete."
      );

      if (publishOrDeleteAction) {
        navigate("/add-article", {
          state: {
            article: {
              title: article.title,
              content: article.content,
              category: article.category.name || "", // Ensure you pass the category name, not object
              tags: article.tags.join(", ") || "", // Pass tags as a string
              source: article.source,
              picture: article.picture,
              author: article.author.name || "", // Ensure you pass the author's name, not object
            },
            action: "publish", // Indicate that this is a publish action
          },
        });
      } else {
        deleteArticle(article._id);
      }
    }
  };

  const publishArticle = async (articleId) => {
    try {
      // Make a PUT request to the same admin add article API to update the article's status to 'published'
      const response = await axios.put(
        `http://localhost:5000/api/admin/articles`, // The same endpoint as admin add article
        { articleId, status: "published" }, // Include the article ID and status to update
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Article published successfully!");
        // Remove from draftArticles and add to publishedArticles
        setDraftArticles(
          draftArticles.filter((article) => article._id !== articleId)
        );
        setPublishedArticles([response.data.newArticle, ...publishedArticles]);
      }
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("Failed to publish article. Please try again.");
    }
  };

  const deleteArticle = async (articleId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/articles/${articleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        alert("Article deleted successfully!");
        // Refresh or update the state as needed
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Please try again.");
    }
  };

  const handleUpgradeSubscription = () => {
    setShowUpgradeModal(true);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleAddArticle = () => {
    navigate("/add-article");
  };

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderArticleCard = (article) => (
    <div className="article-card" key={article._id}>
      <img
        src={article.picture || "placeholder.jpg"}
        alt={article.title}
        className="article-image"
      />
      <div className="article-content">
        <h4>{article.title}</h4>
        {/* <div className="article-stats"> */}
        {/* <span>👍 {article.likes || 0}</span>
          <span>👎 {article.dislikes || 0}</span>
          <span>👁️ {article.views || 0}</span> */}
        {/* </div> */}
      </div>
    </div>
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Details</h2>
        <div className="profile-details">
          <p>
            <strong>First Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.lastName}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phoneNumber}
          </p>
          <p>
            <strong>DOB:</strong> {userData.DOB}
          </p>
          <p>
            <strong>City:</strong> {userData.city}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Subscription:</strong> {subscriptionDetails?.plan || "Free"}
          </p>
          <button onClick={handleEdit} className="edit-button">
            Edit Profile
          </button>
          <button
            onClick={handleUpgradeSubscription}
            className="upgrade-button"
          >
            Upgrade Subscription
          </button>
          {userRole === "provider" && (
            <button onClick={handleAddArticle} className="add-article-button">
              Add Article
            </button>
          )}
        </div>
        {isEditing && (
          <div className="edit-profile-form">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="input-field"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="input-field"
            />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="input-field"
            />
            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
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
            <button
              onClick={handleUpdateProfile}
              className="save-button"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="profile-sections">
        <h3
          onClick={() => toggleDropdown("readingHistory")}
          className="dropdown-header"
        >
          Reading History {dropdowns.readingHistory ? "▼" : "▶"}
        </h3>
        {dropdowns.readingHistory && (
          <div className="dropdown-content">
            {readingHistory.length > 0 ? (
              <div className="articles-grid">
                {readingHistory.map(renderArticleCard)}
              </div>
            ) : (
              <p>No reading history available.</p>
            )}
          </div>
        )}

        <h3
          onClick={() => toggleDropdown("savedArticles")}
          className="dropdown-header"
        >
          Saved Articles {dropdowns.savedArticles ? "▼" : "▶"}
        </h3>
        {dropdowns.savedArticles && (
          <div className="dropdown-content">
            {savedArticles.length > 0 ? (
              <div className="articles-grid">
                {savedArticles.map(renderArticleCard)}
              </div>
            ) : (
              <p>No saved articles available.</p>
            )}
          </div>
        )}

        {userRole === "provider" && (
          <>
            <h3
              onClick={() => toggleDropdown("publishedArticles")}
              className="dropdown-header"
            >
              Published Articles {dropdowns.publishedArticles ? "▼" : "▶"}
            </h3>
            {dropdowns.publishedArticles && (
              <div className="dropdown-content">
                {publishedArticles.length > 0 ? (
                  <div className="articles-grid">
                    {publishedArticles.map(renderArticleCard)}
                  </div>
                ) : (
                  <p>No published articles available.</p>
                )}
              </div>
            )}
          </>
        )}

        {userRole === "provider" && (
          <>
            <h3
              onClick={() => toggleDropdown("draftArticles")}
              className="dropdown-header"
            >
              Draft Articles {dropdowns.draftArticles ? "▼" : "▶"}
            </h3>
            {dropdowns.draftArticles && (
              <div className="dropdown-content">
                {draftArticles.length > 0 ? (
                  <div className="articles-grid">
                    {draftArticles.map((article) => (
                      <div key={article._id} className="article-card">
                        <img
                          src={article.picture || "placeholder.jpg"}
                          alt={article.title}
                          className="article-image"
                        />
                        <div className="article-content">
                          <h4>{article.title}</h4>
                          <button
                            onClick={() => handlePublishOrDelete(article)}
                          >
                            Publish or Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No draft articles available.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showUpgradeModal && (
        <div className="upgrade-modal-overlay">
          <div className="upgrade-modal">
            <h3>Upgrade Your Subscription</h3>
            <div className="subscription-options">
              <div
                className={`subscription-card ${
                  selectedPlan === "Free" ? "selected" : ""
                }`}
                onClick={() => handleSelectPlan("Free")}
              >
                <h4>Free</h4>
                <p>$0/month</p>
              </div>
              <div
                className={`subscription-card ${
                  selectedPlan === "Monthly" ? "selected" : ""
                }`}
                onClick={() => handleSelectPlan("Monthly")}
              >
                <h4>Monthly</h4>
                <p>$1/day</p>
              </div>
              <div
                className={`subscription-card ${
                  selectedPlan === "Yearly" ? "selected" : ""
                }`}
                onClick={() => handleSelectPlan("Yearly")}
              >
                <h4>Yearly</h4>
                <p>$0.25/day</p>
              </div>
            </div>
            <button
              onClick={handleConfirmSubscription}
              className="confirm-button"
            >
              Confirm Subscription
            </button>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
