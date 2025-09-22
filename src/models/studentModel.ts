import mongoose from "mongoose";

export interface PaymentDetail {
  amount?: number;
  currency?: string;
  transactionId?: string;
  paymentMethod?: string;
  paidAt?: Date | null;
  invoiceUrl?: string;
  invoiceGenerated?: boolean;
  planStartDate?: Date;
  planEndDate?: Date;
}

export interface StudentInterface extends mongoose.Document {
  name: string;
  surname: string;
  email: string;
  grade: mongoose.Types.ObjectId;
  tamilGrade?: "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5" | "Grade 6" | "Grade 7" | "Grade 8";
  profileImage?: string;
  sex?: "MALE" | "FEMALE" | "OTHER";
  birthday?: Date;
  role: "Student";
  parent: mongoose.Types.ObjectId;
  attendance: mongoose.Types.ObjectId[];
  assignment: mongoose.Types.ObjectId[];
  announcements: mongoose.Types.ObjectId[];
  selectedPlan?: string;
  sessionType: string;
  sessionLimit?: number;
  sessionUsed?: number;
  billingCycle?: "freeTrial" | "monthly" | "yearly";
  paymentStatus?: "not required" | "pending" | "success" | "failed";
  planStartDate?: Date;
  planEndDate?: Date;
  paymentHistory: PaymentDetail[];
  teacher?: mongoose.Types.ObjectId;
  profileStatus?: "enrolled" | "deEnrolled";
  enrollmentCategory?: "initialCall" | "statusCheck" | "continue" | "hold" | "followUp" |"inActive";
}

const paymentDetailsSchema = new mongoose.Schema<PaymentDetail>(
  {
    amount: { type: Number },
    currency: { type: String },
    transactionId: { type: String },
    paymentMethod: { type: String },
    paidAt: { type: Date, default: null },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    invoiceUrl: { type: String },
    invoiceGenerated: { type: Boolean, default: false },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema<StudentInterface>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String },
    grade: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    tamilGrade: { type: String, enum: ["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8"] },
    profileImage: { type: String },
    sex: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    birthday: Date,
    role: { type: String, enum: ["Student"], default: "Student" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
    assignment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
    selectedPlan: { type: String },
    sessionType: { type: String },
    sessionLimit: { type: Number, default: 1 },
    sessionUsed: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["not required", "pending", "success", "failed"], default: "pending" },
    billingCycle: { type: String, enum: ["freeTrial", "monthly", "yearly"], default: "monthly" },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    paymentHistory: [paymentDetailsSchema],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    profileStatus: { type: String, enum: ["enrolled", "deEnrolled"], default: "enrolled" },
    enrollmentCategory: { type: String, enum: ["initialCall", "statusCheck", "continue", "hold", "followUp", "inActive"], default: "statusCheck" },
  },
  { timestamps: true }
);

const Student = mongoose.models.Student || mongoose.model<StudentInterface>("Student", studentSchema);

export default Student;