import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, required: true }, // or enum validation if needed
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },

  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
}, {
  timestamps: true
});

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
export default Lesson;
