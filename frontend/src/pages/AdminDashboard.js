import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchArticles = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/articles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchArticles();
  }, []);

  return (
    <div>
      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/manage-users">Manage Users</Link>
        <Link to="/admin/manage-articles">Manage Articles</Link>
      </nav>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.role}
            {/* Add buttons for updating or deleting users */}
          </li>
        ))}
      </ul>
      <h2>Articles</h2>
      <ul>
        {articles.map((article) => (
          <li key={article._id}>
            {article.title} - {article.approved ? "Approved" : "Pending"}
            {/* Add buttons for approving, editing, or deleting articles */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
