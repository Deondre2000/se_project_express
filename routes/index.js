const router = require("express").Router();
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const { userLogin, createUser } = require("../controllers/user");
const { NotFoundError } = require("../errors");
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

router.use("/items", clothingItems);

router.use("/users", userRouter);

router.use((req, res, next) => {
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
