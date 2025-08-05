import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import Student from "@/models/studentModel";
import "@/models/classModel";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const classId = req.nextUrl.searchParams.get("classId");
    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 });
    }

    const objectId = new mongoose.Types.ObjectId(classId);
    const students = await Student.find({ grade: objectId }).populate("grade").lean();

    console.log("Fetched students:", students);

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students by classId:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
