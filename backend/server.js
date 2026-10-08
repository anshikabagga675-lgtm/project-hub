require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = new Set([
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL || "").split(",").map((origin) => origin.trim()).filter(Boolean),
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      const error = new Error("This origin is not allowed by the CORS policy.");
      error.status = 403;
      return callback(error);
    },
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Project Hub API is running" });
});
app.get("/", (req, res) => {
  res.json({ success: true, message: "Project Hub API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((req, res, next) => {
  const error = new Error("The requested endpoint was not found.");
  error.status = 404;
  next(error);
});
app.use(errorMiddleware);

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }

  await connectDatabase();
  return app.listen(PORT, () => {
    console.log(`Project Hub API listening on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`Unable to start Project Hub API: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
