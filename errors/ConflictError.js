const { CONFLICT_ERROR } = require("../utils/statusCodes");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

module.exports = ConflictError;
