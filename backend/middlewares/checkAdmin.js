// backend/middlewares/checkAdmin.js
module.exports = (req, res, next) => {
  try {
    // Assuming you have a `user` object in the request which contains role information
    if (req.user && req.user.role === "admin") {
      next(); // User is admin, proceed to the next middleware or route handler
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Authorization check failed." });
  }
};
