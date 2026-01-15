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

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("❌ GET /api/projects/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("📝 POST request received:", req.body);
    
    const { title, description, tech, github, live, technologies, link, category, image, pdf } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newProject = new Project({
      title,
      description,
      tech: tech || technologies || [],
      github,
      live: live || link,
      image: image || '', // Ensure image field is set (even if empty)
      pdf: pdf || '', // PDF file path
      category: category || "development",
    });

    const savedProject = await newProject.save();
    console.log("✅ Project created:", savedProject._id);
    console.log("📸 Project image:", savedProject.image || '(no image)');
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("❌ POST /api/projects error:", error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log("✏️ PUT request for ID:", req.params.id);
    console.log("📝 Request body:", req.body);
    
    const { title, description, tech, github, live, technologies, link, category, image, pdf } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (tech || technologies) updateData.tech = tech || technologies || [];
    if (github !== undefined) updateData.github = github;
    if (live !== undefined || link !== undefined) updateData.live = live || link;
    // Always update image field if provided (even if empty string to clear it)
    if (image !== undefined) {
      updateData.image = image || ''; // Allow empty string to clear image
      console.log("📸 Updating image field:", updateData.image || '(empty/cleared)');
    }
    // Always update PDF field if provided
    if (pdf !== undefined) {
      updateData.pdf = pdf || ''; // Allow empty string to clear PDF
      console.log("📄 Updating PDF field:", updateData.pdf || '(empty/cleared)');
    }
    if (category) updateData.category = category;
    
    console.log("📦 Update data:", updateData);
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log("✅ Project updated:", req.params.id);
    console.log("📸 Final project image:", project.image || '(no image)');
    res.json(project);
  } catch (error) {
    console.error("❌ PUT /api/projects/:id error:", error);
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
