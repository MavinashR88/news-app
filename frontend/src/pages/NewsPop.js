import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewsPop.css";

const NewsPop = ({ article, onClose, userId }) => {
  const [likes, setLikes] = useState(article.likes || 0);
  const [dislikes, setDislikes] = useState(article.dislikes || 0);
  const [comments, setComments] = useState(article.comments || []);
  const [commentContent, setCommentContent] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // Initialize like/dislike state for the current user
    setHasLiked(article.likedBy.includes(userId));
    setHasDisliked(article.dislikedBy.includes(userId));
  }, [article, userId]);

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/like`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setHasLiked(true);
      setHasDisliked(false);
    } catch (error) {
      console.error(
        "Error liking article:",
        error.response?.data || error.message
      );
    }
  };

  const handleDislike = async () => {
    if (hasDisliked) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/dislike`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setHasLiked(false);
      setHasDisliked(true);
    } catch (error) {
      console.error(
        "Error disliking article:",
        error.response?.data || error.message
      );
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/comment`,
        { userId, content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data); // Update comments with new list
      setCommentContent(""); // Clear input
    } catch (error) {
      console.error(
        "Error submitting comment:",
        error.response?.data || error.message
      );
    }
  };

  const handleSaveArticle = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/user/save-article`,
        { userId, articleId: article._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Article saved successfully!");
    } catch (error) {
      console.error(
        "Error saving article:",
        error.response?.data || error.message
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

        <div className="news-pop-actions">
          <button onClick={handleLike} disabled={hasLiked}>
            {hasLiked ? "Liked" : "Like"} ({likes})
          </button>
          <button onClick={handleDislike} disabled={hasDisliked}>
            {hasDisliked ? "Disliked" : "Dislike"} ({dislikes})
          </button>
          <button onClick={handleSaveArticle}>Save Article</button>
        </div>

        <div className="news-pop-comments">
          <h4>Comments</h4>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <strong>{comment.userName}:</strong> {comment.content}
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
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
  );
};

export default NewsPop;
