const Article = require('../models/Article');

exports.createArticle = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const article = new Article({ title, content, category, author: req.user.id });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name');
    res.json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
