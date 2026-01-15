import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error("❌ GET /api/projects error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("📝 POST request received:", req.body);
    
    const { title, description, tech, github, live, technologies, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newProject = new Project({
      title,
      description,
      tech: tech || technologies || [],
      github,
      live: live || link,
    });

    const savedProject = await newProject.save();
    console.log("✅ Project created:", savedProject._id);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("❌ POST /api/projects error:", error);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑️ DELETE request for ID:", req.params.id);
    
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log("✅ Project deleted:", req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /api/projects error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
