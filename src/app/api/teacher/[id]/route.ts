import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Teacher from "@/models/teacherModel";
import {} from "@/models/subjectModel";
import {} from "@/models/classModel";

// GET single teacher by ID
export async function GET(
  req: NextRequest,
 { params } : { params: Promise<{ id: string }> }
) {  const { id } = await params;
  try {
    await connectMongoDB();
    const teacher = await Teacher.findById(id).select("-password").populate("subjects", "name")   
      .populate("classes", "name");
    if (!teacher) {
      return NextResponse.json({ msg: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json({ teacher }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: "Failed to get teacher", error: err }, { status: 500 });
  }
}

// DELETE a teacher by ID
export async function DELETE(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
   const { id } = await params;
  try {
    await connectMongoDB();
    const deleted = await Teacher.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ msg: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json({ msg: "Teacher deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: "Delete failed", error: err }, { status: 500 });
  }
}
