const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mainRouter = require("./routes/index");
const { NOT_FOUND } = require("./utils/errors");

const app = express();

const { PORT = 3001, JWT_SECRET = "dev-secret-key" } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

  app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer ")) {
    try {
      const token = authorization.replace("Bearer ", "");
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    } catch (err) {
    }
  }

  if (!req.user) {
    req.user = { _id: "5d8b8592978f8bd833ca8133" };
  }

  next();
});

app.use("/", mainRouter);

app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Requested resource not found" })
);


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
