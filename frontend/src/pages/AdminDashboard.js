import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./AdminDashboard.css"; // Make sure to create this CSS file for styling

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer",
  });
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    source: "",
    category: "",
  });

  const token = localStorage.getItem("authToken");

  // Memoized fetch functions to avoid unnecessary re-creation
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error.response?.data || error);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
    }
  }, [token]);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/articles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data);
    } catch (error) {
      console.error("Error fetching articles:", error.response?.data || error);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error
      );
    }
  }, [token]);

  // Update data based on the active section
  useEffect(() => {
    if (activeSection === "dashboard") {
      fetchAnalytics();
    } else if (activeSection === "users") {
      fetchUsers();
    } else if (activeSection === "articles") {
      fetchArticles();
    } else if (activeSection === "categories") {
      fetchCategories();
    }
  }, [
    activeSection,
    fetchAnalytics,
    fetchUsers,
    fetchArticles,
    fetchCategories,
  ]);

  // Handlers for User Management
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error.response?.data || error);
      }
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Name, email, and password are required fields.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/users",
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password, // Add password
          role: newUser.role || "customer", // Default role
          subscription: "Free", // Optional
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User added successfully:", res.data);
      setNewUser({ name: "", email: "", password: "", role: "customer" }); // Clear fields
      fetchUsers();
      setActiveSection("users");
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response?.data || error.message
      );
      alert(
        `Failed to add user: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // Handlers for Article Management
  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/articles/${articleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArticles(articles.filter((article) => article._id !== articleId));
      } catch (error) {
        console.error("Error deleting article:", error.response?.data || error);
      }
    }
  };

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.category) {
      alert("Please fill out all required fields for the article.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/admin/articles",
        {
          title: newArticle.title,
          content: newArticle.content, // Ensure field matches the backend
          category: newArticle.category,
          source: newArticle.source || "Unknown", // Optional field
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form fields
      setNewArticle({
        title: "",
        content: "",
        source: "",
        category: "",
      });

      // Refresh articles and navigate
      fetchArticles();
      setActiveSection("articles");
    } catch (error) {
      console.error(
        "Error adding article:",
        error.response?.data || error.message
      );
      alert(
        `Failed to add article: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handlers for Category Management
  const handleAddCategory = async () => {
    if (!newCategory) {
      alert("Category name cannot be empty.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/admin/categories",
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li onClick={() => setActiveSection("dashboard")}>Dashboard Home</li>
          <li onClick={() => setActiveSection("users")}>User Management</li>
          <li onClick={() => setActiveSection("addUser")}>Add User</li>
          <li onClick={() => setActiveSection("articles")}>
            Article Management
          </li>
          <li onClick={() => setActiveSection("addArticle")}>Add Article</li>
          <li onClick={() => setActiveSection("categories")}>
            Category Management
          </li>
          <li onClick={() => setActiveSection("analytics")}>Analytics</li>
        </ul>
      </div>

      <div className="main-content">
        {activeSection === "dashboard" && (
          <div>
            <h2>Dashboard Analytics</h2>
            <div className="analytics-cards">
              <div className="card">
                Total Users: {analytics.totalUsers || 0}
              </div>
              <div className="card">
                Total Articles: {analytics.totalArticles || 0}
              </div>
              <div className="card">
                Total Views: {analytics.totalViews || 0}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Total Users", value: analytics.totalUsers || 0 },
                  {
                    name: "Total Articles",
                    value: analytics.totalArticles || 0,
                  },
                  { name: "Total Views", value: analytics.totalViews || 0 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeSection === "users" && (
          <div>
            <h2>User Management</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Subscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.subscription || "Free"}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "addUser" && (
          <div>
            <h2>Add New User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={newUser.password || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Role:</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit">Add User</button>
            </form>
          </div>
        )}

        {activeSection === "articles" && (
          <div>
            <h2>Article Management</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Source</th>
                  <th>Published Date</th>
                  <th>View Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td>{article.title}</td>
                    <td>{article.source}</td>
                    <td>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </td>
                    <td>{article.viewCount}</td>
                    <td>
                      <button onClick={() => handleDeleteArticle(article._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "addArticle" && (
          <div>
            <h2>Add New Article</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddArticle();
              }}
            >
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Content:</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, content: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div>
                <label>Category:</label>
                <select
                  value={newArticle.category}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, category: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Source:</label>
                <input
                  type="text"
                  value={newArticle.source}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, source: e.target.value })
                  }
                />
              </div>
              <button type="submit">Add Article</button>
            </form>
          </div>
        )}

        {activeSection === "categories" && (
          <div>
            <h2>Category Management</h2>
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category._id} className="category-item">
                  {category.name}
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
              className="category-input"
            />
            <button onClick={handleAddCategory} className="add-category-button">
              Add Category
            </button>
          </div>
        )}

        {activeSection === "analytics" && (
          <div>
            <h2>Analytics Section</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
