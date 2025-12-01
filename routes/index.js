const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const {
  userLogin,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/user");
const auth = require("../middlewares/auth");


router.post("/signin", userLogin);
router.post("/signup", createUser);

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUser);

router.use("/users", userRouter);
router.use("/items", clothingItems);

module.exports = router;
