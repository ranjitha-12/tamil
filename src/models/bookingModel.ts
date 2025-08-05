import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: { type: String, enum: ['available', 'booked'] },
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;