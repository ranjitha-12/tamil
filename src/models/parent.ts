import mongoose from "mongoose";

export interface ParentInterface extends mongoose.Document {
  username?: string;
  whatsapp: string;
  email: string;
  password: string;
  motherFirstName?: string;
  motherLastName?: string;
  fatherFirstName?: string;
  fatherLastName?: string;
  students: mongoose.Types.ObjectId[];
  role: "Parent";
  state?: string;
  country: string;
  profileImage?: string;
}

const parentSchema = new mongoose.Schema<ParentInterface>({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  whatsapp: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Parent"], default: "Parent", required: true },
  state: { type: String },
  country: { type: String, required: true },
  motherFirstName: { type: String },
  motherLastName: { type: String },
  fatherFirstName: { type: String },
  fatherLastName: { type: String },
  profileImage: { type: String },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

const Parent = mongoose.models.Parent || mongoose.model<ParentInterface>("Parent", parentSchema);
export default Parent;