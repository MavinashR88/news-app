// // src/components/Navbar.js
// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = ({ isLoggedIn, userRole, handleLogout }) => {
//   return (
//     <nav>
//       <Link to="/">Home</Link>
//       {isLoggedIn ? (
//         <>
//           <Link to="/newsfeed">NewsFeed</Link>
//           <Link to="/profile">Profile</Link>
//           {userRole === "admin" && <Link to="/admin">Admin Dashboard</Link>}
//           {userRole === "provider" && (
//             <Link to="/provider">Provider Dashboard</Link>
//           )}
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <Link to="/login">Login</Link>
//           <Link to="/signup">Signup</Link>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        {user ? (
          <>
            {user.role === "customer" && (
              <>
                <li>
                  <Link to="/home">Home</Link>
                </li>
                <li>
                  <Link to="/categories">Categories</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              </>
            )}
            {user.role === "admin" && (
              <>
                <li>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/users">Manage Users</Link>
                </li>
                <li>
                  <Link to="/admin/articles">Manage Articles</Link>
                </li>
              </>
            )}
            {user.role === "provider" && (
              <>
                <li>
                  <Link to="/home">Home</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/add-article">Add Article</Link>
                </li>
                <li>
                  <Link to="/manage-articles">Manage Articles</Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
