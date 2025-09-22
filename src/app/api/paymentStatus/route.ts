import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Student from "@/models/studentModel";
import Parent from "@/models/parent";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { studentId, transactionId } = await req.json();
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Missing student ID" },
        { status: 400 }
      );
    }
    const student = await Student.findById(studentId).populate("parent");
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }
    // Check if plan has expired before updating status
    const now = new Date();
    if (student.planEndDate && now > student.planEndDate) {
      student.paymentStatus = "pending";
    } else {
      student.paymentStatus = "success";
    }
    await student.save();
    const parent = await Parent.findById(
      (student.parent as mongoose.Types.ObjectId)._id || student.parent
    );
    if (!parent) {
      return NextResponse.json(
        { success: false, message: "Parent not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      studentId: (student._id as mongoose.Types.ObjectId).toString(),
      paymentStatus: student.paymentStatus,
    });
  } catch (err) {
    console.error("Payment status update error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}