const mongoose = require("mongoose");

async function connectDatabase() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is required to start the API.");
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`MongoDB connection failed (${error.name}).`);
    throw error;
  }
}

module.exports = connectDatabase;
