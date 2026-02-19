const { PORT = 3001, JWT_SECRET = "dev-secret-key" } = process.env;

const DB_ADDRESS = "mongodb://127.0.0.1:27017/wtwr_db";

module.exports = {
  PORT,
  JWT_SECRET,
  DB_ADDRESS,
};