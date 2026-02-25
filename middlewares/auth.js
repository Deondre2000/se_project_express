const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Auth middleware - decoded payload:", payload);
    req.user = payload;
  } catch (err) {
    console.log("Auth middleware - token verification failed:", err.message);
    throw new UnauthorizedError("Invalid token");
  }

  return next();
};
