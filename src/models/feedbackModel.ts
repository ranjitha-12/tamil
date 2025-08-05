import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  parentId: string;
  parentName: string;
  studentName: string;
  teacherId: string;
  rating: number;
  discussionSummary: string;
  feedbackText: string;
  suggestions: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  parentId: { type: String, required: true },
  parentName: { type: String, required: true },
  studentName: { type: String, required: true },
  teacherId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  discussionSummary: { type: String, required: true },
  feedbackText: { type: String, required: true },
  suggestions: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);