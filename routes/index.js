const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");

// Lightweight request logger to help diagnose 404s during PUT requests
router.use((req, res, next) => {
  // Example: "PUT /items/123"
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.use("/users", userRouter);
router.use("/items", clothingItems);
router.use("/clothingitems", clothingItems);

router.use((req, res) => {
  console.warn("No route matched:", req.method, req.originalUrl);
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
