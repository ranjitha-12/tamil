import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
}, {
  timestamps: true
});

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
export default Announcement;
