import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }],
}, {
  timestamps: true
});

const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
export default Exam;
