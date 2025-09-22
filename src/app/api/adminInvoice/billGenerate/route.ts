import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Student from "@/models/studentModel";
import { calculatePlanDates } from "@/lib/planDate";

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();
    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }
    await connectMongoDB();
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (
      student.enrollmentCategory !== "continue" ||
      student.profileStatus !== "enrolled" ||
      student.paymentStatus !== "pending"
    ) {
      return NextResponse.json(
        { error: "Student is not eligible for bill generation" },
        { status: 400 }
      );
    }
    if (!student.planEndDate) {
      return NextResponse.json(
        { error: "Student has no planEndDate set" },
        { status: 400 }
      );
    }
    const currentPlanEndDate = new Date(student.planEndDate);
    if (isNaN(currentPlanEndDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid planEndDate for student" },
        { status: 400 }
      );
    }
    // always move to next cycle start
    let nextMonth = currentPlanEndDate.getMonth() + 1;
    let nextYear = currentPlanEndDate.getFullYear();
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    // Get the last successful payment amount
    const successfulPayments = student.paymentHistory.filter(
      (payment: any) => payment.transactionId && payment.paidAt
    );

    if (successfulPayments.length === 0) {
      return NextResponse.json(
        { error: "No previous payment history found" },
        { status: 400 }
      );
    }

    // Sort by paidAt date descending and get the most recent payment
    const lastSuccessfulPayment = successfulPayments.sort(
      (a: any, b: any) =>
        new Date(b.paidAt || "").getTime() - new Date(a.paidAt || "").getTime()
    )[0];

    const paymentAmount = lastSuccessfulPayment?.amount ?? 0;

    const selectedPlanName: string = student.selectedPlan ?? "Unknown Plan";

    const { planStartDate, planEndDate, sessionLimit } = calculatePlanDates(
      selectedPlanName,
      student.billingCycle ?? "monthly",
      student.sessionType ?? "1h",
      { price: paymentAmount, name: selectedPlanName },
      nextMonth,
      nextYear
    );

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $set: {
          sessionLimit,
          sessionUsed: 0,
          planStartDate,
          planEndDate,
        },
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        student: updatedStudent,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error generating Bill:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}