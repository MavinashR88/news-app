import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "./AddArticlePage.css"; // Make sure to create this CSS file for styling

const AddArticlePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("");
  const [picture, setPicture] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("draft"); // Default to draft
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  // Handle article submission as draft
  const handleSaveAsDraft = async (e) => {
    e.preventDefault();

    const articleData = {
      title,
      content,
      category: category || "Uncategorized",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      source,
      picture: picture || null,
      author,
      status: "draft", // Explicitly set status as draft
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/articles/draft", // Endpoint for saving as draft
        articleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Article saved as draft:", response.data);
      navigate("/profile"); // Redirect after saving
    } catch (error) {
      console.error(
        "Error saving article as draft:",
        error.response?.data || error.message
      );
      alert("Article could not be saved as draft. Please try again.");
    }
  };

  // Handle article submission to be published
  const handlePublishArticle = async (e) => {
    e.preventDefault();

    const articleData = {
      title,
      content,
      category: category || "Uncategorized",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      source,
      picture: picture || null,
      author,
      status: "published", // Explicitly set status as published
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/articles", // Endpoint for publishing article
        articleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Article published successfully:", response.data);
      navigate("/profile"); // Redirect after publishing
    } catch (error) {
      console.error(
        "Error publishing article:",
        error.response?.data || error.message
      );
      alert("Article could not be published. Please try again.");
    }
  };

  return (
    <div className="article-add-page">
      <div className="modal-content">
        <h2>Add Article</h2>
        <form>
          {/* Title Input */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Content Input */}
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {/* Category Input */}
          <input
            type="text"
            placeholder="Category (will be created if missing)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          {/* Tags Input */}
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Source Input */}
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />

          {/* Picture Input */}
          <input
            type="text"
            placeholder="Picture URL (optional)"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />

          {/* Author Input */}
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          {/* Status (Draft/Publish) */}
          <div className="status-selector">
            <label>
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
              />
              Draft
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === "published"}
                onChange={() => setStatus("published")}
              />
              Publish
            </label>
          </div>

          {/* Submit and Cancel Buttons */}
          <button type="button" onClick={handleSaveAsDraft}>
            Save as Draft
          </button>
          <button type="button" onClick={handlePublishArticle}>
            Publish Article
          </button>
          <button type="button" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddArticlePage;
