import mongoose from "mongoose";

export interface StudentInterface extends mongoose.Document {
  name: string;
  surname: string;
  email: string;
  age: number;
  phone?: string;
  grade: mongoose.Types.ObjectId;
  profileImage?: string;
  sex?: "MALE" | "FEMALE" | "OTHER";
  birthday?: Date;
  role: "Student";
  parent: mongoose.Types.ObjectId;
  attendance: mongoose.Types.ObjectId[];
  assignment: mongoose.Types.ObjectId[];
  announcements: mongoose.Types.ObjectId[];
  selectedPlan?: string;
  sessionLimit?: number;
  sessionUsed?: number;
  planStartDate?: Date;
  planEndDate?: Date;
  paymentStatus?: "not required" | "pending" | "completed" | "failed";
  paymentDetails?: {
    amount: number;
    currency: string;
    transactionId: string;
    paymentMethod: string;
    paidAt: Date;
  };
}

const paymentDetailsSchema = new mongoose.Schema(
  {
    amount: Number,
    currency: String,
    transactionId: String,
    paymentMethod: String,
    paidAt: Date,
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema<StudentInterface>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    age: { type: Number, required: true },
    grade: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    profileImage: { type: String },
    sex: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    birthday: Date,
    role: { type: String, enum: ["Student"], default: "Student" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
    assignment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
    selectedPlan: { type: String }, 
    sessionLimit: { type: Number, default: 1 },
    sessionUsed: { type: Number, default: 0 },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    paymentStatus: {
      type: String,
      enum: ["not required", "pending", "completed", "failed"],
      default: "pending",
    },
    paymentDetails: paymentDetailsSchema,
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model<StudentInterface>("Student", studentSchema);

export default Student;