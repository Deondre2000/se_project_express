const router = require("express").Router();
const clothingItems = require("./clothingitems");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItems);
router.use("/clothingitems", clothingItems);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
