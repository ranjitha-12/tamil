import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Parent from "@/models/parent";
import Student from "@/models/studentModel";
import Booking from "@/models/bookingModel";
import Teacher from "@/models/teacherModel";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const parentId = req.nextUrl.searchParams.get("parentId");

    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }
    const parent = await Parent.findOne({ _id: parentId }).populate("students");

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }
    const studentIds = parent.students.map((student: any) => student._id);

    const bookings = await Booking.find({ studentId: { $in: studentIds } });

    const teacherIdsSet = new Set(bookings.map((booking) => booking.teacherId.toString()));
    const teacherIds = Array.from(teacherIdsSet);

    const teachers = await Teacher.find({ _id: { $in: teacherIds } })
      .select("name surname email");

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error("Error fetching teachers for parent:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}