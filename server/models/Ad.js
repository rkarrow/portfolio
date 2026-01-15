import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  link: String,
  category: {
    type: String,
    enum: ["development", "graphic", "uiux", "diy"],
    default: "development",
  },
  position: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ad = mongoose.model("Ad", adSchema);

export default Ad;
export { Ad };
