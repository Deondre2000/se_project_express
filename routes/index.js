const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const { userLogin, createUser } = require("../controllers/user");
const { NOT_FOUND } = require("../errors");
const {
  validateLoginBody,
  validateSignUpBody,
} = require("../middlewares/validation");

router.post(
  "/signin",
  validateLoginBody,
  userLogin
);

router.post(
  "/signup",
  validateSignUpBody,
  createUser
);

router.post(
  "/users",
  validateSignUpBody,
  createUser
);

router.use("/items", clothingItems);

router.use("/users", userRouter);

router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Requested resource not found" })
);

module.exports = router;
