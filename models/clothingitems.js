const mongoose = require("mongoose");
const Validator = require("validator");
const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => Validator.isURL(v),
      message: "Link is not a valid URL",
    },
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
