import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Attendance from "@/models/attendanceModel";
import Student from "@/models/studentModel";
import "@/models/bookingModel"; 

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const studentId = req.nextUrl.searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    const student = await Student.findById(studentId)
      .select("name surname email grade")
      .lean();
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const attendances = await Attendance.find({ student: studentId })
      .sort({ date: -1 })
      .populate({
        path: "booking",
        select: "title start end",
      })
      .lean();

    return NextResponse.json({ student, attendances }, { status: 200 });

  } catch (error) {
    console.error("Fetch attendance error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
