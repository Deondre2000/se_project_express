const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    throw new BadRequestError("All fields (name, avatar, email, password) are required");
  }

  try {
    const parsed = new URL(avatar);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new BadRequestError("You must enter a valid URL");
    }
  } catch (e) {
    throw new BadRequestError("You must enter a valid URL");
  }

  return User.findOne({ email })
    .then((existingByEmail) => {
      if (existingByEmail) {
        throw new ConflictError("Email already exists");
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
      if (err.name === "ValidationError") {
        throw new BadRequestError("Invalid user data");
      } else if (err.name === "MongoServerError" && err.code === 11000) {
        let key = null;
        if (err.keyPattern) {
          [key] = Object.keys(err.keyPattern);
        } else if (err.keyValue) {
          [key] = Object.keys(err.keyValue);
        }
        if (key === "email") {
          throw new ConflictError("Email already exists");
        } else if (key === "name") {
          throw new ConflictError("Name already exists");
        } else {
          throw new ConflictError("Duplicate key");
        }
      } else {
        throw err;
      }
    })
    .catch(next);
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
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
    .catch(() => {
      throw new UnauthorizedError("Incorrect email or password");
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
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
        return next(new NotFoundError("User not found"));
      } else if (err.name === "CastError") {
        throw new BadRequestError("Invalid user ID");
      } else {
        throw err;
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  const update = {};
  if (name !== undefined) update.name = name;
  if (avatar !== undefined) update.avatar = avatar;

  return User.findByIdAndUpdate(_id, update, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      } else if (err.name === "ValidationError") {
        throw new BadRequestError("Invalid user data");
      } else if (err.name === "CastError") {
        throw new BadRequestError("Invalid user ID");
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  userLogin,
  getCurrentUser,
  updateUser,
};
