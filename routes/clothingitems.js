const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

router.post("/", createItem);

router.get("/", getItems);

router.put("/:itemId", updateItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", unlikeItem);

router.delete("/:itemId", deleteItem);

module.exports = router;
