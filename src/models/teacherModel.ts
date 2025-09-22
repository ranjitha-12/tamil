import mongoose from "mongoose";
import { isValidPhoneNumber } from 'libphonenumber-js';

export type UserSex = "MALE" | "FEMALE" | "OTHER";

export interface TeacherInterface extends mongoose.Document {
  name: string;
  surname: string;
  email: string;
  resume?: string;
  phone: string;
  additionalPhone: string;
  address: string;
  profileImage?: string;
  bloodType: string;
  sex: UserSex;
  createdAt: Date;
  birthday: Date;
  password: string;
  role: "Teacher";
  subjects: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
}

const teacherSchema = new mongoose.Schema<TeacherInterface>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  resume: { type: String },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v: string) {
        return !v || isValidPhoneNumber(v);
      },
      message: (props: any) => `${props.value} is not a valid phone number!`,
    },
  },
  additionalPhone: { type: String },
  address: { type: String, required: true },
  profileImage: { type: String },
  bloodType: { type: String, required: true },
  sex: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
  createdAt: { type: Date, default: Date.now },
  birthday: { type: Date, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Teacher"], required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

const Teacher = mongoose.models.Teacher || mongoose.model<TeacherInterface>("Teacher", teacherSchema);
export default Teacher;