import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewsPop.css";

const NewsPop = ({ article, onClose, userId }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [views, setViews] = useState(article.views || 0); // State for article views

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!article || !article._id) return;

    const likedBy = article.likedBy || [];
    const dislikedBy = article.dislikedBy || [];

    setLikes(article.likedBy ? article.likedBy.length : 0); // Set total likes
    setDislikes(article.dislikedBy ? article.dislikedBy.length : 0); // Set total dislikes
    setHasLiked(likedBy.includes(userId));
    setHasDisliked(dislikedBy.includes(userId));

    // Fetch comments for the article
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/articles/${article._id}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(res.data);
        console.log("Fetched comments:", res.data); // Log fetched comments
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();

    // Check if article is saved by the user
    const checkIfSaved = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}/saved-articles`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSaved(res.data.savedArticles.includes(article._id));
        console.log("Check if article is saved:", res.data.savedArticles); // Log saved articles response
      } catch (error) {
        console.error("Error checking saved articles:", error);
      }
    };

    checkIfSaved();

    // Update views when the component is mounted
    const updateViews = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/articles/${article._id}/increment-views`,
          { articleId: article._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200) {
          setViews(res.data.views); // Update local state with the new view count
          console.log("Updated views:", res.data.views); // Log the updated views
        }
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    updateViews();
  }, [article, userId, token]);

  // Handle like action
  const handleLike = async () => {
    if (hasLiked) {
      alert("You have already liked this article!");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/like`,
        { articleId: article._id, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
        setHasLiked(true);
        setHasDisliked(false);
        console.log("Like added, response:", res.data); // Log like action response
      }
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  // Handle dislike action
  const handleDislike = async () => {
    if (hasDisliked) {
      alert("You have already disliked this article!");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/dislike`,
        { articleId: article._id, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
        setHasDisliked(true);
        setHasLiked(false);
        console.log("Dislike added, response:", res.data); // Log dislike action response
      }
    } catch (error) {
      console.error("Error disliking article:", error);
    }
  };

  // Handle save article
  const handleSave = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/${userId}/save-article`,
        { userId, articleId: article._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setIsSaved(true);
        alert("Article saved successfully!");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save the article. Please try again.");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      alert("Comment content cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/comments`,
        {
          userId, // Make sure userId is being passed correctly
          text: commentContent, // Text for the comment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setComments((prev) => [response.data.comment, ...prev]);
        setCommentContent("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          src={article.picture || "path/to/fallback-image.jpg"}
          alt={article.title}
          className="news-pop-image"
        />
        <p className="news-pop-content">{article.content}</p>

        {/* Add views count */}
        <p className="news-pop-views">Views: {views}</p>

        <div className="news-pop-actions">
          <button onClick={handleLike} disabled={hasLiked}>
            {hasLiked ? "Liked" : "Like"} ({likes})
          </button>
          <button onClick={handleDislike} disabled={hasDisliked}>
            {hasDisliked ? "Disliked" : "Dislike"} ({dislikes})
          </button>
          <button onClick={handleSave} disabled={isSaved}>
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        <div className="news-pop-comments">
          <h4 className="comments-title">Comments</h4>
          <div className="comments-section">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment-container">
                  <strong>{comment.userId?.name || "Anonymous"}</strong>
                  <p>{comment.text}</p>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
          <div className="add-comment-container">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              disabled={isSubmitting}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={isSubmitting || !commentContent.trim()}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPop;
