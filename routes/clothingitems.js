const router = require("express").Router();

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

router.post("/", createItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", unlikeItem);

router.delete("/:itemId", deleteItem);

module.exports = router;
