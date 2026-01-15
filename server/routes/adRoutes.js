import express from "express";
import Ad from "../models/Ad.js";

const router = express.Router();

// Get all ads
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find().sort({ category: 1, position: 1 });
    res.json(ads);
  } catch (error) {
    console.error("❌ GET /api/ads error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get ads by category
router.get("/category/:category", async (req, res) => {
  try {
    const ads = await Ad.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ position: 1 });
    res.json(ads);
  } catch (error) {
    console.error("❌ GET /api/ads/category/:category error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new ad
router.post("/", async (req, res) => {
  try {
    console.log("📝 POST request received:", req.body);
    
    const { title, description, imageUrl, link, category, position } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newAd = new Ad({
      title,
      description,
      imageUrl,
      link,
      category: category || "development",
      position: position || 0,
    });

    const savedAd = await newAd.save();
    console.log("✅ Ad created:", savedAd._id);
    res.status(201).json(savedAd);
  } catch (error) {
    console.error("❌ POST /api/ads error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Update an ad
router.put("/:id", async (req, res) => {
  try {
    console.log("✏️ PUT request for ID:", req.params.id);
    
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }
    
    console.log("✅ Ad updated:", req.params.id);
    res.json(ad);
  } catch (error) {
    console.error("❌ PUT /api/ads/:id error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete an ad
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑️ DELETE request for ID:", req.params.id);
    
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }
    console.log("✅ Ad deleted:", req.params.id);
    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /api/ads/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
