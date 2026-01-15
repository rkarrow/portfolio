import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tech: [String],
  github: String,
  live: String,
  image: String, // Cover photo URL
  pdf: String, // PDF file URL (for UI/UX design projects)
  // category identifies which section this project belongs to
  // e.g. "development" | "graphic" | "uiux"
  category: {
    type: String,
    default: "development",
  },
});

// Create the model once, then export it both as default and named
const Project = mongoose.model("Project", projectSchema);

export default Project;
export { Project };
