const { JWT_SECRET = "dev-secret-key" } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "All fields (name, avatar, email, password) are required",
    });
  }

  try {
    const parsed = new URL(avatar);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "You must enter a valid URL" });
    }
  } catch (e) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "You must enter a valid URL" });
  }

  return User.findOne({ email })
    .then((existingByEmail) => {
      if (existingByEmail) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "Email already exists" });
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) =>
          res.status(201).send({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          })
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        let key = null;
        if (err.keyPattern) {
          [key] = Object.keys(err.keyPattern);
        } else if (err.keyValue) {
          [key] = Object.keys(err.keyValue);
        }
        if (key === "email") {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "Email already exists" });
        }
        if (key === "name") {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "Name already exists" });
        }
        return res.status(CONFLICT_ERROR).send({ message: "Duplicate key" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Email and password are required",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(
        "[userLogin] Login successful for user:",
        user._id,
        user.name,
        user.email
      );
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  console.log("[getCurrentUser] Looking for user with ID:", _id);

  User.findById(_id)
    .orFail()
    .then((user) => {
      console.log("[getCurrentUser] Found user:", user.name);
      const userObject = user.toObject();
      res.status(200).send({
        _id: userObject._id,
        id: userObject._id,
        name: userObject.name,
        avatar: userObject.avatar,
        email: userObject.email,
      });
    })
    .catch((err) => {
      console.error("[getCurrentUser] Error:", err.name, err.message);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  const update = {};
  if (name !== undefined) update.name = name;
  if (avatar !== undefined) update.avatar = avatar;

  return User.findByIdAndUpdate(_id, update, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createUser,
  userLogin,
  getCurrentUser,
  updateUser,
};
