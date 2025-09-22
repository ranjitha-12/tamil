import { NextRequest, NextResponse } from "next/server";
import Student, { StudentInterface } from "@/models/studentModel";
import Parent from "@/models/parent";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { 
      studentId, 
      parentId, 
      amount, 
      currency, 
      transactionId, 
      paymentMethod, 
      paidAt, 
      planStartDate, 
      planEndDate,
      billingCycle,
      sessionType,
      sessionLimit,
      planName, billingDetails,
    } = await req.json();

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const parent = await Parent.findById(parentId);
    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    const normalizedCurrency = typeof currency === 'string' ? currency.toUpperCase() : currency;
    
    // Prepare payment record
    const paymentRecord = {
      amount,
      currency: normalizedCurrency,
      transactionId,
      paymentMethod,
      paidAt: new Date(paidAt),
      billingDetails,
      planStartDate: planStartDate ? new Date(planStartDate) : undefined,
      planEndDate: planEndDate ? new Date(planEndDate) : undefined, 
    };

    student.paymentHistory.push(paymentRecord);

    if (planStartDate) student.planStartDate = new Date(planStartDate);
    if (planEndDate) student.planEndDate = new Date(planEndDate);
    if (billingCycle) student.billingCycle = billingCycle;
    if (sessionType) student.sessionType = sessionType;
    if (sessionLimit) student.sessionLimit = sessionLimit;
    if (planName) student.selectedPlan = planName;

    student.paymentStatus = "success";
    await student.save();

    return NextResponse.json({
      success: true,
      student,
      transactionId,
      billingDetails,
    });
  } catch (error: any) {
    console.error("Save Payment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");
    const studentId = searchParams.get("studentId");

    if (studentId) {
      const student = await Student.findById(studentId).lean<StudentInterface>();
      if (!student) {
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        paymentHistory: student.paymentHistory,
        student,
      });
    }
    if (parentId) {
      const students = await Student.find({ parent: parentId }).lean<StudentInterface[]>();
      return NextResponse.json({ success: true, students });
    }
    return NextResponse.json(
      { error: "Either studentId or parentId is required" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Get Payment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}