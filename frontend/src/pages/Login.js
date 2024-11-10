// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Login.css";
// import "./NewsFeed.js";
// import "./Signup.js";
// import "./AdminDashboard.js";
// import "./ProviderDashboard.js";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         {
//           email,
//           password,
//         }
//       );

//       // Assuming the backend returns a role field, which specifies the user role
//       const { role } = response.data;
//       console.log("Login successful:", response.data);

//       // Role-based redirection
//       if (role === "admin") {
//         navigate("/admin"); // Redirect to the admin dashboard
//       } else if (role === "provider") {
//         navigate("/provider"); // Redirect to the provider dashboard
//       } else {
//         navigate("/newsfeed"); // Redirect to customer news feed by default
//       }
//     } catch (error) {
//       console.error(
//         "Login error:",
//         error.response ? error.response.data : error.message
//       );
//       setError("Login failed. Please check your credentials.");
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h2>Sign In to Your Account</h2>
//         <p className="welcome-message">
//           Stay informed with the latest news tailored for you.
//         </p>

//         {error && <p style={{ color: "red" }}>{error}</p>}

//         <form onSubmit={handleLogin}>
//           <div className="input-group">
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>

//         <div className="options">
//           <a href="/forgot-password">Forgot Password?</a>
//           <span> | </span>
//           <a href="/signup">Create an Account</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

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
        {
          email,
          password,
        }
      );

      const { token, role } = response.data; // Get token and role from response

      // Save the token to localStorage
      localStorage.setItem("token", token);

      console.log("Login successful:", response.data);

      // Role-based redirection
      if (role === "admin") {
        navigate("/admin"); // Redirect to the admin dashboard
      } else if (role === "provider") {
        navigate("/provider"); // Redirect to the provider dashboard
      } else {
        navigate("/newsfeed"); // Redirect to customer news feed by default
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Sign In to Your Account</h2>
        <p className="welcome-message">
          Stay informed with the latest news tailored for you.
        </p>

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
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="options">
          <a href="/forgot-password">Forgot Password?</a>
          <span> | </span>
          <a href="/signup">Create an Account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
