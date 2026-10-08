const mongoose = require("mongoose");

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateObjectId(value, fieldName = "id") {
  if (!mongoose.isValidObjectId(value)) {
    throw createHttpError(400, `A valid ${fieldName} is required.`);
  }
  return value;
}

function getObjectId(value) {
  return value && typeof value === "object" && value._id ? value._id : value;
}

function sameId(first, second) {
  const firstId = getObjectId(first);
  const secondId = getObjectId(second);
  return Boolean(firstId && secondId && firstId.toString() === secondId.toString());
}

module.exports = { createHttpError, validateObjectId, sameId };
