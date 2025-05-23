const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token and extract user ID
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if auth header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "User Not Authorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Safely extract the token

  jwt.verify(token, process.env.LoginKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.userId; // Add user ID to request object
    next();
  });
}

module.exports = verifyToken;
