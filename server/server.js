import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
console.log("✅ Environment loaded");
console.log("Using PORT:", process.env.PORT);

const app = express();
console.log("✅ Express app created");

app.use(cors());
app.use(express.json());

// Debug middleware to log all requests (placed early to catch all)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Serve static files from client/public
app.use("/images", express.static(path.join(__dirname, "../client/public/images")));
app.use("/pdfs", express.static(path.join(__dirname, "../client/public/pdfs")));

// API Routes - IMPORTANT: Register before catch-all route
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);

// Log all routes for debugging
console.log("✅ Routes registered:");
console.log("  - /api/projects");
console.log("  - /api/upload");
console.log("  - POST /api/upload/image");
console.log("  - POST /api/upload/pdf");
console.log("  - GET /api/upload/test");
console.log("  - GET /api/upload/pdf/test");

app.get("/", (req, res) => {
  res.send("Portfolio API Running");
});

// Catch-all for undefined routes (must be last)
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

const PORT = process.env.PORT || 5005;

// Start server immediately without waiting for DB
const server = app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`✅ API URL: http://localhost:${PORT}`);
});

// Try to connect DB in the background, don't block server startup
connectDB().catch(err => console.log("DB connection attempted:", err.message));
