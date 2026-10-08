const mongoose = require("mongoose");

async function connectDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required to start the API.");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
}

module.exports = connectDatabase;
