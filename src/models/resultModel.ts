import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
}, {
  timestamps: true
});

const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);
export default Result;
