const Validator = require("validator");
const clothingitems = require("../models/clothingitems");
const ClothingItem = require("../models/clothingitems");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const Name = typeof req.body.name === "string" ? req.body.name : "";
  const name = Name.trim();
  const { weather, imageUrl } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Name is required" });
  }
  if (name.length < 3 || name.length > 30) {
    return res
      .status(400)
      .send({ message: "Name must be between 3 and 30 characters" });
  }

  if (!weather) {
    return res.status(400).send({ message: "Weather is required" });
  }

  if (!imageUrl) {
    return res.status(400).send({ message: "ImageUrl is required" });
  }
  if (!Validator.isURL(String(imageUrl))) {
    return res.status(400).send({ message: "ImageUrl must be a valid URL" });
  }

  return ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send({ data: item }))
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

  if (imageUrl && !Validator.isURL(String(imageUrl))) {
    return res.status(400).send({ message: "ImageUrl must be a valid URL" });
  }

  return clothingitems
    .findOneAndUpdate(
      { _id: itemId },
      { $set: { imageUrl } },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: e.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  return clothingitems
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: e.message });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  return clothingitems
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: e.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingitems
    .findByIdAndDelete(itemId)
    .orFail(() => new Error("Item not found"))
    .then(() => res.status(200).send({}))
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: e.message });
    });
};

module.exports = {
  getClothingItems,
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
