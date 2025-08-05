import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import "@/models/assignmentModel"; 
import Student from "@/models/studentModel";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const studentId = req.nextUrl.searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }
    const student = await Student.findById(studentId).populate({
      path: "assignment",
      populate: {
        path: "teacher",
        select: "name email",
      },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ assignments: student.assignment }, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
