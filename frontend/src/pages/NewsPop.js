import React, { useState } from "react";
import axios from "axios";
import "./NewsPop.css";

const NewsPop = ({ article, onClose, userId }) => {
  const [likes, setLikes] = useState(article.likes);
  const [dislikes, setDislikes] = useState(article.dislikes);
  const [comments, setComments] = useState(article.comments);
  const [commentContent, setCommentContent] = useState("");

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/${article._id}/like`,
        { userId }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes); // Update dislikes in case a dislike was removed
    } catch (error) {
      console.error(
        "Error liking article:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/${article._id}/dislike`,
        { userId }
      );
      setLikes(res.data.likes); // Update likes in case a like was removed
      setDislikes(res.data.dislikes);
    } catch (error) {
      console.error(
        "Error disliking article:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/${article._id}/comment`,
        {
          userId,
          content: commentContent,
        }
      );
      setComments(res.data); // Update comments with the latest comments array
      setCommentContent(""); // Clear the comment input
    } catch (error) {
      console.error(
        "Error submitting comment:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="news-pop-overlay">
      <div className="news-pop-container">
        <span className="news-pop-close" onClick={onClose}>
          &times;
        </span>
        <h2 className="news-pop-title">{article.title}</h2>
        <img
          src={article.urlToImage}
          alt={article.title}
          className="news-pop-image"
        />
        <p className="news-pop-content">{article.content}</p>
        <p className="news-pop-meta">
          <strong>Source:</strong> {article.source}
          <br />
          <strong>Published at:</strong>{" "}
          {new Date(article.publishedAt).toLocaleString()}
        </p>

        <div className="news-pop-tags">
          {article.tags.map((tag, index) => (
            <span key={index} className="news-pop-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="news-pop-actions">
          <button
            className="news-pop-action-button news-pop-like-button"
            onClick={handleLike}
          >
            Like ({likes})
          </button>
          <button
            className="news-pop-action-button news-pop-dislike-button"
            onClick={handleDislike}
          >
            Dislike ({dislikes})
          </button>
        </div>

        <div className="news-pop-comments">
          <h4>Comments</h4>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="news-pop-comment">
                <strong>{comment.userName}</strong>: {comment.content}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          <div className="news-pop-comment-input">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
            />
            <button onClick={handleCommentSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPop;
