const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();
const { PORT, DB_ADDRESS } = require("./utils/config");

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', (req, res, next) => {
  setTimeout(() => {
    return next(new Error('Server will crash now'));
  }, 0);
});

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
