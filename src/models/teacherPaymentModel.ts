import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    attendanceCount: { type: Number, required: true },
    amount: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const TeacherPayment = mongoose.models.Payment || mongoose.model('TeacherPayment', paymentSchema);
export default TeacherPayment;