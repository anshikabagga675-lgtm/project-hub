require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({ message: "Project Hub API is running" });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "The requested endpoint was not found." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
    ? error.status
    : 500;
  const message = status === 500
    ? "An unexpected server error occurred."
    : "The request could not be processed.";

  if (status === 500) {
    console.error(error);
  }

  return res.status(status).json({ message });
});

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to a secret at least 32 characters long.");
  }

  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Project Hub API listening on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`Unable to start Project Hub API: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
