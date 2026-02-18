const jwt = require("jsonwebtoken");
const { UNAUTHORIZED, UnauthorizedError } = require("../errors");

const { JWT_SECRET = "dev-secret-key" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Auth middleware - decoded payload:", payload);
    req.user = payload;
    return next();
  } catch (err) {
    console.log("Auth middleware - token verification failed:", err.message);
    return next(new UnauthorizedError("Invalid token"));
  }
};
