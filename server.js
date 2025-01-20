const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const connectDB = require("./utils/db");

dotenv.config();

const app = express();

// Connect to the database
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1); // Exit if the database connection fails
});

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.status = 404;
  next(err);
});

// Error handling middleware (should be the last middleware)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
