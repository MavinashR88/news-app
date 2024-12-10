import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
    } else {
      console.error("No token found in localStorage.");
      navigate("/login");
    }
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          userId,
          newPassword,
        }
      );
      alert(response.data.message); // Show success message
      navigate("/login"); // Redirect to login after successful password change
    } catch (error) {
      console.error(
        "Failed to change password:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <form onSubmit={handlePasswordChange}>
      <div>
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;
