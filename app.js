import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Error Handling Middleware
app.use(errorHandler);

export { app };