const clothingitems = require("../models/clothingitems");
const ClothingItem = require("../models/clothingitems");

const getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  clothingitems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  clothingitems
    .findByIdAndUpdate(
      itemId,
      { $set: { imageUrl } },
      { new: true, runValidators: true }
    )
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(500).send({ message: e.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  clothingitems
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(500).send({ message: e.message });
    });
};

module.exports = {
  getClothingItems,
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
