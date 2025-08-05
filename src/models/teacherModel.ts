import mongoose from "mongoose";
import { isValidPhoneNumber } from 'libphonenumber-js';

export type UserSex = "MALE" | "FEMALE" | "OTHER";

export interface TeacherInterface extends mongoose.Document {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  bloodType: string;
  sex: UserSex;
  createdAt: Date;
  birthday: Date;
  password: string;
  role: "Teacher";
  subjects: mongoose.Types.ObjectId[];
  classes: mongoose.Types.ObjectId[];
  assignments: {
    classes: string;
    subjects: string;
    slots: {
      date: string;                
      localTime: string;    
      utcTime: string;      
    }[];
  }[];
  students: mongoose.Types.ObjectId[];
  attendanceCount?: number;
}

const teacherSchema = new mongoose.Schema<TeacherInterface>({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
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
  address: { type: String, required: true },
  profileImage: { type: String },
  bloodType: { type: String, required: true },
  sex: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
  createdAt: { type: Date, default: Date.now },
  birthday: { type: Date, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Teacher"], required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  assignments: [
    {
      classes: { type: String, required: true },
      subjects: { type: String, required: true },
      slots: [
        {
          date: { type: String, required: true },
          localTime: { type: String, required: true },
          utcTime: { type: String, required: true },
        },
      ],
    },
  ],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  attendanceCount: { type: Number, default: 0 },
}, { timestamps: true });

const Teacher = mongoose.models.Teacher || mongoose.model<TeacherInterface>("Teacher", teacherSchema);
export default Teacher;