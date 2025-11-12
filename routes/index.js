const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");

// Lightweight request logger to help diagnose 404s during PUT requests
router.use((req, res, next) => {
  // Example: "PUT /items/123"
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  console.warn("No route matched:", req.method, req.originalUrl);
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
