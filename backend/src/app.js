import cors from "cors";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import emergencyContactRoutes from "./routes/emergencyContactRoutes.js";
import { verifyToken } from "./middleware/auth.js";

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Dent AI API is running" });
});

app.get("/api/auth/test", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token verified successfully", user: req.user });
});

app.use("/api/auth", authRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: "Unexpected server error", error: err.message });
});

export default app;
