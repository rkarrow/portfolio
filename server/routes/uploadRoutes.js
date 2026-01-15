import express from "express";
import upload from "../config/upload.js";
import uploadPdf from "../config/uploadPdf.js";

const router = express.Router();

console.log("✅ Upload routes module loaded");

// Verify PDF upload config is imported
try {
  console.log("✅ PDF upload config imported:", typeof uploadPdf);
} catch (err) {
  console.error("❌ Failed to import PDF upload config:", err);
}

// Single file upload route
router.post("/image", (req, res) => {
  console.log("📤 POST /api/upload/image received");
  
  // Use multer middleware with error handling
  upload.single("image")(req, res, (err) => {
    // Handle multer errors
    if (err) {
      console.error("❌ Upload error:", err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File too large. Maximum size is 5MB." });
      }
      if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message || "Failed to upload image" });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log("⚠️ No file in request");
      return res.status(400).json({ error: "No file uploaded. Please select an image file." });
    }

    try {
      // Return the path relative to the public folder
      const imagePath = `/images/${req.file.filename}`;
      
      console.log("✅ Image uploaded successfully:", imagePath);
      res.json({
        success: true,
        imagePath: imagePath,
        filename: req.file.filename
      });
    } catch (error) {
      console.error("❌ Upload processing error:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

// PDF upload route - MUST be registered before catch-all routes
router.post("/pdf", (req, res, next) => {
  console.log("📤 POST /api/upload/pdf received");
  console.log("📤 Request headers:", req.headers['content-type']);
  console.log("📤 Request body keys:", Object.keys(req.body || {}));
  console.log("📤 UploadPdf middleware type:", typeof uploadPdf.single);
  
  // Use multer middleware with error handling
  uploadPdf.single("pdf")(req, res, (err) => {
    // Handle multer errors
    if (err) {
      console.error("❌ PDF upload error:", err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File too large. Maximum size is 50MB." });
      }
      if (err.message && err.message.includes('Only PDF files')) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message || "Failed to upload PDF" });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log("⚠️ No file in request");
      return res.status(400).json({ error: "No file uploaded. Please select a PDF file." });
    }

    try {
      // Return the path relative to the public folder
      const pdfPath = `/pdfs/${req.file.filename}`;
      
      console.log("✅ PDF uploaded successfully:", pdfPath);
      res.json({
        success: true,
        pdfPath: pdfPath,
        filename: req.file.filename
      });
    } catch (error) {
      console.error("❌ PDF upload processing error:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

// Test route to verify upload endpoint is accessible
router.get("/test", (req, res) => {
  console.log("📤 GET /api/upload/test received");
  res.json({ message: "Upload route is working", timestamp: new Date().toISOString() });
});

// Test PDF route endpoint
router.get("/pdf/test", (req, res) => {
  console.log("📤 GET /api/upload/pdf/test received");
  res.json({ 
    message: "PDF upload route is registered", 
    timestamp: new Date().toISOString(),
    availableEndpoints: ["POST /api/upload/pdf"]
  });
});

export default router;
