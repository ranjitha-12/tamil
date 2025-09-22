import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Student from "@/models/studentModel";
import Teacher from "@/models/teacherModel";

export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const { studentId, tamilGrade, teacherId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // If teacher is being assigned, verify the teacher exists
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return NextResponse.json(
          { error: "Teacher not found" },
          { status: 404 }
        );
      }
    }

    // Prepare update object
    const updateData: any = {};
    if (tamilGrade) updateData.tamilGrade = tamilGrade;
    if (teacherId) updateData.teacher = teacherId;

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    ).populate("teacher", "name surname")
    .populate("parent", "fatherFirstName fatherLastName motherFirstName motherLastName");

    return NextResponse.json(
      { message: "Student updated successfully", student: updatedStudent },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating student:", err);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}