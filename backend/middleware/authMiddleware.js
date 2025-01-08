const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Token error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateUser };
