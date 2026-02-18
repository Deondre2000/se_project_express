const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");
const auth = require("../middlewares/auth");
const {
  validateItemBody,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(auth);

router.post(
  "/",
  validateItemBody,
  createItem
);

router.put(
  "/:itemId/likes",
  validateItemId,
  likeItem
);

router.delete(
  "/:itemId/likes",
  validateItemId,
  unlikeItem
);

router.delete(
  "/:itemId",
  validateItemId,
  deleteItem
);

module.exports = router;
