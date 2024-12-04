import React, { useState } from "react";
import axios from "axios";

const AddArticlePage = () => {
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    source: "",
    category: "",
  });
  const token = localStorage.getItem("authToken");

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content || !newArticle.category) {
      alert("Please fill out all required fields for the article.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/admin/articles",
        {
          title: newArticle.title,
          content: newArticle.content,
          category: newArticle.category,
          source: newArticle.source || "Unknown", // Optional
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Article added successfully!");
      setNewArticle({ title: "", content: "", source: "", category: "" });
    } catch (error) {
      console.error(
        "Error adding article:",
        error.response?.data || error.message
      );
      alert("Failed to add article.");
    }
  };

  return (
    <div>
      <h2>Add New Article</h2>
      <form onSubmit={handleAddArticle}>
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
          <input
            type="text"
            value={newArticle.category}
            onChange={(e) =>
              setNewArticle({ ...newArticle, category: e.target.value })
            }
            required
          />
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
  );
};

export default AddArticlePage;
