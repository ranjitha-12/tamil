import mongoose from "mongoose";

interface AdminInterface {
  name: string;
  email: string;
  password: string;
  role: "Admin";
  profileImage?: string; 
}

const adminSchema = new mongoose.Schema<AdminInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin"], required: true },
  profileImage: { type: String }, 
},
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model<AdminInterface>('Admin', adminSchema);
export default Admin;
