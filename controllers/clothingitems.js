const Validator = require("validator");
const clothingItems = require("../models/clothingitems");
const clothingItem = require("../models/clothingitems");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const getclothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!weather) {
    return next(new BadRequestError("Weather is required"));
  }

  if (!imageUrl) {
    return next(new BadRequestError("ImageUrl is required"));
  }
  if (!Validator.isURL(String(imageUrl))) {
    return next(new BadRequestError("ImageUrl must be a valid URL"));
  }

  return clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid item data"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  return clothingItems
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  return clothingItems
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItems
    .findById(itemId)
    .orFail()
    .then((item) => {
      const itemOwner = item.owner.toString();
      const requester = String(req.user && req.user._id);
      if (itemOwner !== requester) {
        throw new ForbiddenError("You do not have permission to delete this item");
      }
      return clothingItems
        .findByIdAndDelete(itemId)
        .then(() => res.status(200).send({}));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
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
