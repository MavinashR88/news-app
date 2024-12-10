// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(403).json({ message: "Access Denied" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid Token" });
//     req.user = user; // Set the user info from token in the request
//     next();
//   });
// };

// exports.authenticateUser = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach decoded user info to request
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// exports.authorizeProvider = (req, res, next) => {
//   if (req.user.role !== "provider") {
//     return res
//       .status(403)
//       .json({ message: "Forbidden: Access restricted to providers" });
//   }
//   next();
// };

// module.exports = verifyToken;
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token part after "Bearer"
  console.log("Token:", token); // Debugging log
  // If no token, return an error
  if (!token) return res.status(403).json({ message: "Access Denied" });

  // Verify the token and extract user data
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    console.log("User from Token:", user);
    // Attach the user data to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

// Optionally, you can have a separate authorization function based on roles
exports.authorizeProvider = (req, res, next) => {
  if (req.user.role !== "provider") {
    return res
      .status(403)
      .json({ message: "Forbidden: Access restricted to providers" });
  }
  next();
};

module.exports = verifyToken;
