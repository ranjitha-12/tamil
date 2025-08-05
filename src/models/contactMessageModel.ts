import mongoose, { Schema, Document } from 'mongoose';

export interface ContactMessageDocument extends Document {
  name: string;
  email: string;
  message: string;
}

const ContactMessageSchema = new Schema<ContactMessageDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
},
  { timestamps: true }
);

export default mongoose.models.ContactMessage ||
  mongoose.model<ContactMessageDocument>('ContactMessage', ContactMessageSchema);