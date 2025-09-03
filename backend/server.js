// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

// basic middlewares
app.use(morgan("dev"));
app.use(express.json());

// CORS for dev
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// static serve images at /schoolImages/<filename>
app.use(
  "/schoolImages",
  express.static(path.join(__dirname, "schoolImages"))
);

// routes
app.use("/api/schools", schoolRoutes);

// connect DB then start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
