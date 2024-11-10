// backend/controllers/adminArticleController.js
const Article = require("../models/Article");

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles" });
  }
};

exports.editArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const article = await Article.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Error updating article" });
  }
};

exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    await Article.findByIdAndDelete(id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting article" });
  }
};

exports.approveArticle = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  try {
    const article = await Article.findByIdAndUpdate(
      id,
      { approved },
      { new: true }
    );
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Error approving article" });
  }
};
