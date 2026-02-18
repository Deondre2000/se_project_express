const { JWT_SECRET = "dev-secret-key" } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(
      new BadRequestError("All fields (name, avatar, email, password) are required")
    );
  }

  try {
    const parsed = new URL(avatar);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return next(new BadRequestError("You must enter a valid URL"));
    }
  } catch (e) {
    return next(new BadRequestError("You must enter a valid URL"));
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
        next(new BadRequestError("Invalid user data"));
      } else if (err.name === "MongoServerError" && err.code === 11000) {
        let key = null;
        if (err.keyPattern) {
          [key] = Object.keys(err.keyPattern);
        } else if (err.keyValue) {
          [key] = Object.keys(err.keyValue);
        }
        if (key === "email") {
          next(new ConflictError("Email already exists"));
        } else if (key === "name") {
          next(new ConflictError("Name already exists"));
        } else {
          next(new ConflictError("Duplicate key"));
        }
      } else {
        next(err);
      }
    });
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
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
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(new UnauthorizedError("Incorrect email or password"));
      }
    });
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
        next(new NotFoundError("User not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
      }
    });
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
        next(new NotFoundError("User not found"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  userLogin,
  getCurrentUser,
  updateUser,
};
