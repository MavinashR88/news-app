// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login route

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     console.log("User role:", user.role); // Debugging line to confirm the role

//     // Send the role along with the token
//     res.json({ message: "Login successful", token, role: user.role });
//   } catch (error) {
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate the token with userId, role, and passwordChangeRequired
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         role: user.role,
//         passwordChangeRequired: user.passwordChangeRequired,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Respond with the token, role, userId, and passwordChangeRequired
//     res.json({
//       message: "Login successful",
//       token,
//       role: user.role,
//       userId: user._id,
//       passwordChangeRequired: user.passwordChangeRequired, // Include this field
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Login failed" });
//   }
// });
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return res
        .status(403)
        .json({
          error: "Your account has been blocked. Please contact support.",
        });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate the token with userId, role, and passwordChangeRequired
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        passwordChangeRequired: user.passwordChangeRequired,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with the token, role, userId, and passwordChangeRequired
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      passwordChangeRequired: user.passwordChangeRequired,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/change-password", async (req, res) => {
  console.log("Change-password route hit."); // Add this
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    console.log("Missing userId or newPassword"); // Add this
    return res
      .status(400)
      .json({ message: "User ID and new password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      passwordChangeRequired: false,
    });
    console.log("Password updated successfully."); // Add this
    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error in change-password route:", error.message);
    res.status(500).json({ error: "Failed to change password." });
  }
});

router.get("/", (req, res) => {
  res.send("Auth API is working!");
});

module.exports = router;
