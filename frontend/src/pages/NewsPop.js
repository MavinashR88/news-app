import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewsPop.css";

const NewsPop = ({ article, onClose, userId }) => {
  const [likes, setLikes] = useState(article.likes || 0);
  const [dislikes, setDislikes] = useState(article.dislikes || 0);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("authToken");
  console.log(token);
  useEffect(() => {
    // Initialize like/dislike state
    setHasLiked(article.likedBy.includes(userId));
    setHasDisliked(article.dislikedBy.includes(userId));

    // Fetch comments
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/articles/${article._id}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 200) {
          setComments(res.data);
        }
      } catch (error) {
        console.error(
          "Error fetching comments:",
          error.response?.data || error.message
        );
      }
    };

    fetchComments();
  }, [article, userId, token]);

  const handleLike = async () => {
    if (hasLiked) {
      alert("You have already liked this article!");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/like`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
        setHasLiked(true);
        setHasDisliked(false);
        alert("Article liked successfully!");
      }
    } catch (error) {
      console.error(
        "Error liking article:",
        error.response?.data || error.message
      );
      alert("Failed to like the article. Please try again.");
    }
  };

  const handleDislike = async () => {
    if (hasDisliked) {
      alert("You have already disliked this article!");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/dislike`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
        setHasDisliked(true);
        setHasLiked(false);
        alert("Article disliked successfully!");
      }
    } catch (error) {
      console.error(
        "Error disliking article:",
        error.response?.data || error.message
      );
      alert("Failed to dislike the article. Please try again.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      alert("Comment content cannot be empty.");
      return;
    }

    setIsSubmitting(true); // Start loading
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/comment`,
        { userId, content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setComments(res.data.comments);
        setCommentContent("");
        alert("Comment added successfully!");
      } else {
        console.error("Unexpected response status:", res.status);
        alert("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error submitting comment:",
        error.response?.data || error.message
      );
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  <button onClick={handleCommentSubmit} disabled={isSubmitting}>
    {isSubmitting ? "Submitting..." : "Submit"}
  </button>;

  return (
    <div className="news-pop-overlay">
      <div className="news-pop-container">
        <span className="news-pop-close" onClick={onClose}>
          &times;
        </span>
        <h2 className="news-pop-title">{article.title}</h2>
        <img
          src={article.urlToImage || "path/to/fallback-image.jpg"}
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
        </div>

        <div className="news-pop-comments">
          <h4>Comments</h4>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment">
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
            disabled={isSubmitting}
          />
          <button onClick={handleCommentSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPop;
