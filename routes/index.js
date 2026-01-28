const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const clothingItems = require("./clothingitems");
const userRouter = require("./users");
const { userLogin, createUser } = require("../controllers/user");

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  userLogin
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser
);

router.post(
  "/users",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser
);

router.use("/items", clothingItems);

router.use("/users", userRouter);

module.exports = router;
