// frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

import { jwtDecode } from "jwt-decode"; // Use named import

const token = localStorage.getItem("authToken"); // Retrieve the token
if (!token) {
  console.error("No token found in localStorage");
}

const decodedToken = jwtDecode(token);
console.log(decodedToken);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, role, userId, passwordChangeRequired } = response.data; // Extract passwordChangeRequired
      localStorage.setItem("authToken", token); // Store token in localStorage
      localStorage.setItem("userId", userId); // Store userId in localStorage

      if (passwordChangeRequired) {
        // Redirect to password change page if required
        navigate("/change-password");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/newsfeed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      if (error.response?.status === 403) {
        setError("Your account has been blocked. Please contact support.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Sign In to Your Account</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <button
            type="button"
            className="signup-redirect-btn"
            onClick={handleSignupRedirect}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
