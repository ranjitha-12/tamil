import mongoose from "mongoose";

export interface AssignmentInterface extends mongoose.Document {
  title: string;  
  description?: string;
  dueDate: Date;
  student: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  status: "PENDING" | "COMPLETED" | "OVERDUE";
  submissionDate?: Date;
  grade?: number;
  feedback?: string;
  attachments?: {
    teacherFiles?: {
      fileName: string;
      fileUrl: string;
      uploadedAt: Date;
    }[];
    studentFiles?: {
      fileName: string;
      fileUrl: string;
      uploadedAt: Date;
    }[];
  };
}

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  status: { type: String, enum: ["PENDING", "COMPLETED", "OVERDUE"], default: "PENDING" },
  submissionDate: Date,
  grade: { type: Number, min: 0, max: 100 },
  feedback: String,
  attachments: {
    teacherFiles: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      }
    ],
    studentFiles: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      }
    ]
  }
}, { timestamps: true });

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
export default Assignment;
