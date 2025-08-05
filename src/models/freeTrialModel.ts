import mongoose from 'mongoose';

const freeTrialSchema = new mongoose.Schema({
  parentEmail: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
  bookedAt: { type: Date, default: Date.now },
});

export default mongoose.models.FreeTrial || mongoose.model('FreeTrial', freeTrialSchema);
