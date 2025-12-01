const Validator = require("validator");
const clothingItems = require("../models/clothingitems");
const clothingItem = require("../models/clothingitems");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const getclothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!weather) {
    return res.status(BAD_REQUEST).send({ message: "Weather is required" });
  }

  if (!imageUrl) {
    return res.status(BAD_REQUEST).send({ message: "ImageUrl is required" });
  }
  if (!Validator.isURL(String(imageUrl))) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "ImageUrl must be a valid URL" });
  }

  return clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  return clothingItems
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: e.message });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  return clothingItems
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: e.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findById(itemId)
    .orFail(() => new Error("Item not found"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }
      return clothingItems.findByIdAndDelete(itemId).then(() => res.status(200).send({}));
    })
    .catch((e) => {
      if (e.message === "Item not found") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: e.message });
    });
};

module.exports = {
  getclothingItems,
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
