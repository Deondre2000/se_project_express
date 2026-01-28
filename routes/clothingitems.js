const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");
const auth = require("../middlewares/auth");

router.get("/", getItems);

router.use(auth);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      weather: Joi.string().required().valid("hot", "warm", "cold"),
      imageUrl: Joi.string().required().uri(),
    }),
  }),
  createItem
);

router.put(
  "/:itemId/likes",
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().required().alphanum().length(24),
    }),
  }),
  likeItem
);

router.delete(
  "/:itemId/likes",
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().required().alphanum().length(24),
    }),
  }),
  unlikeItem
);

router.delete(
  "/:itemId",
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().required().alphanum().length(24),
    }),
  }),
  deleteItem
);

module.exports = router;
