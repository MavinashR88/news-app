import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; // Ensure this contains the necessary styling

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
  const [showReadingHistory, setShowReadingHistory] = useState(false);
  const [showSavedArticles, setShowSavedArticles] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showCardForm, setShowCardForm] = useState(false); // New state for card form
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

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

  const handleUpgradeClick = () => setShowUpgradeModal(true);

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setShowCardForm(plan !== "Free"); // Only show card form if plan is paid
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleUpgradeSubscription = async () => {
    if (selectedPlan === "Free") {
      setSubscriptionDetails("Free");
      setShowUpgradeModal(false);
      return;
    }

    try {
      // Update subscription in the backend
      const response = await axios.put(
        "http://localhost:5000/api/user/subscription", // Assuming this is the API endpoint for updating the subscription
        { subscription: selectedPlan },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update subscription details in the frontend after successful backend update
      setSubscriptionDetails(response.data.subscription);
      alert(`Subscribed to ${selectedPlan} plan!`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription. Please try again.");
    }

    setShowUpgradeModal(false);
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

        <button onClick={handleUpgradeClick} className="upgrade-button">
          Upgrade Subscription
        </button>
      </div>

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

      {/* Upgrade Subscription Modal */}
      {showUpgradeModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select a Subscription Plan</h3>
            <div className="plan-options">
              <div
                className={`plan-card ${
                  selectedPlan === "Free" ? "selected" : ""
                }`}
                onClick={() => handlePlanSelection("Free")}
              >
                <h4>Free</h4>
                <p>Delayed news updates.</p>
              </div>
              <div
                className={`plan-card ${
                  selectedPlan === "Monthly" ? "selected" : ""
                }`}
                onClick={() => handlePlanSelection("Monthly")}
              >
                <h4>Monthly</h4>
                <p>$1 per day, immediate access to latest news.</p>
              </div>
              <div
                className={`plan-card ${
                  selectedPlan === "Yearly" ? "selected" : ""
                }`}
                onClick={() => handlePlanSelection("Yearly")}
              >
                <h4>Yearly</h4>
                <p>$0.5 per day, immediate access to latest news.</p>
              </div>
            </div>

            {showCardForm && (
              <div className="card-form">
                <h4>Enter Card Details</h4>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  className="input-field"
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="Expiry Date (MM/YY)"
                  value={cardDetails.expiryDate}
                  onChange={handleCardInputChange}
                  className="input-field"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  className="input-field"
                />
              </div>
            )}

            <button onClick={handleUpgradeSubscription} className="save-button">
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
