import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], required: true },
  lateDuration: { type: String },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
}, {
  timestamps: true
});

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
export default Attendance;
