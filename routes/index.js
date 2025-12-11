const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const { userLogin, createUser } = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/signin", userLogin);
router.post("/signup", createUser);
router.post("/users", createUser);

router.use("/items", clothingItems);

router.use("/users", userRouter);

module.exports = router;
