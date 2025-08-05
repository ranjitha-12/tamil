import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Booking from "@/models/bookingModel";
import Student from "@/models/studentModel";
import "@/models/classModel";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    await Student.findOne(); 
    const teacherId = req.nextUrl.searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json({ message: "Teacher ID is required" }, { status: 400 });
    }

    const bookings = await Booking.find({ teacherId }).populate({
      path: "studentId",
      populate: { path: "grade", model: "Class", select: "name" }
    });

    const uniqueStudentsMap = new Map();
    bookings.forEach((booking) => {
      const student = booking.studentId;
      if (student && !uniqueStudentsMap.has(student._id.toString())) {
        uniqueStudentsMap.set(student._id.toString(), student);
      }
    });

    const students = Array.from(uniqueStudentsMap.values());
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students by teacher:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
