import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Student from "@/models/studentModel";
import "@/models/classModel";
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const parentId = req.nextUrl.searchParams.get("parentId");

    if (!parentId) {
      return NextResponse.json({ message: "Parent ID is required" }, { status: 400 });
    }

    const students = await Student.find({ parent: parentId }).populate("grade", "name").lean();

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Fetch students by parent error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
