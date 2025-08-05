import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
}, {
  timestamps: true
});

const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
export default Subject;
