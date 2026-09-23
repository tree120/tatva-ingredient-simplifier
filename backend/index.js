const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Serve uploaded ingredient images statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FoodLens Server running on http://localhost:${PORT}`);
});