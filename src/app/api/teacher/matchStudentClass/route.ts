import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Student from "@/models/studentModel";
import Teacher from "@/models/teacherModel";
import "@/models/classModel";
import "@/models/subjectModel";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const studentId = req.nextUrl.searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 });
    }

    // Step 1: Fetch the student and populate grade
    const student = await Student.findById(studentId).populate("grade", "name");
    if (!student || !student.grade) {
      return NextResponse.json({ message: "Student or class not found" }, { status: 404 });
    }

    const classId = student.grade._id.toString();

    // Step 2: Find teachers teaching that class
    const teachers = await Teacher.find({
      classes: { $in: [classId] },
    })
      .select("name surname email profileImage classes subjects address")
      .populate("classes", "name")
      .populate("subjects", "name");

    return NextResponse.json(teachers, { status: 200 });
  } catch (error) {
    console.error("Error fetching teachers by student class:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}