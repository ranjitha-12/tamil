import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Assignment from "@/models/assignmentModel";
import Student from "@/models/studentModel";
import Teacher from "@/models/teacherModel";
import mongoose from "mongoose";

// GET: Fetch all assignments
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const assignments = await Assignment.find()
      .populate("student", "name surname grade")
      .populate("teacher", "name surname email")
      .sort({ createdAt: -1 });

    return NextResponse.json(assignments, { status: 200 });
  } catch (err) {
    console.error("Fetching assignments error:", err);
    return NextResponse.json({ error: "Failed to load assignments" }, { status: 500 });
  }
}

// DELETE: Delete an assignment and update student record
export async function DELETE(req: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("id");

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return NextResponse.json({ error: "Invalid or missing assignment ID" }, { status: 400 });
    }
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const studentId = assignment.student;
    await Assignment.findByIdAndDelete(assignmentId);
    await Student.findByIdAndUpdate(
      studentId,
      { $pull: { assignments: assignmentId } }, 
      { new: true }
    );

    return NextResponse.json({ message: "Assignment deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
  }
}