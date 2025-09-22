import { NextRequest, NextResponse } from "next/server"; 
import { connectMongoDB } from "@/lib/mongodb";
import Parent from "@/models/parent";
import Student from "@/models/studentModel";
import SubscriptionPlan from "@/models/subscriptionModel";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();
    let { 
      plan, 
      billingCycle = "monthly", 
      parentId, 
      studentId, 
      sessionType, 
      startMonth, 
      startYear,  
    } = body;
    
    if (!plan || !billingCycle || !parentId || !studentId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // For freeTrial, sessionType might not be required? Adjust as per your logic.
    if (!sessionType && plan.toLowerCase() !== "freeTrial") {
      return NextResponse.json(
        { success: false, message: "Missing session type" },
        { status: 400 }
      );
    }

    const parent = await Parent.findById(parentId);
    if (!parent)
      return NextResponse.json(
        { success: false, message: "Parent not found" },
        { status: 404 }
      );
      
    const studentExists = parent.students?.some(
      (s: any) => s.toString() === studentId
    );
    
    if (!studentExists)
      return NextResponse.json(
        { success: false, message: "Student does not belong to this parent" },
        { status: 403 }
      );
      
    const student = await Student.findById(studentId);
    if (!student)
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
      
    // Check if student already used freeTrial
    if (student.selectedPlan === "freeTrial" && plan === "freeTrial") {
      return NextResponse.json(
        { success: false, message: "Free Trial plan already used." },
        { status: 403 }
      );
    }
    
    // Find the subscription plan. Note: value in DB might be "freeTrial" (case-sensitive).
    const selectedPlan = await SubscriptionPlan.findOne({ value: plan });
    if (!selectedPlan)
      return NextResponse.json(
        { success: false, message: "Subscription plan not found" },
        { status: 404 }
      );

    let sessionLimit = 0;
    let planStartDate = new Date();
    let planEndDate = new Date();
    let paymentDetails: any = null;
    let weeklySessions = 0;
    
    if (sessionType === "1h") weeklySessions = 2;
    else if (sessionType === "30m") weeklySessions = 4;
    else if (sessionType === "40m") weeklySessions = 3;
    
    if (billingCycle === "monthly") {
      if (startMonth === undefined || startYear === undefined) {
        return NextResponse.json(
          { success: false, message: "Start month and year are required for monthly billing" },
          { status: 400 }
        );
      }
      planStartDate = new Date(startYear, startMonth, 1, 0, 0, 0, 0);
      planEndDate = new Date(startYear, startMonth + 1, 0, 23, 59, 59, 999);
      sessionLimit = 4 * weeklySessions;
      const monthlyPrice = Number(selectedPlan.price);
      const totalAmount = monthlyPrice;
      paymentDetails = {
        monthlyPrice,
        sessions: sessionLimit,
        totalAmount,
        sessionType,
        billingCycle,
        planName: selectedPlan.name,
        planStartDate: planStartDate.toISOString(),
        planEndDate: planEndDate.toISOString()
      };
    }
    else if (billingCycle === "yearly") {
      const today = new Date();
      // Start: first day of current month
      planStartDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
      // End: last day of month before same month next year
      planEndDate = new Date(today.getFullYear() + 1, today.getMonth(), 0, 23, 59, 59, 999);
      sessionLimit = 52 * weeklySessions;
      const yearlyPrice = selectedPlan.price * 11; 
      paymentDetails = {
        yearlyPrice,
        sessions: sessionLimit,
        totalAmount: yearlyPrice,
        sessionType,
        billingCycle,
        planName: selectedPlan.name,
        planStartDate: planStartDate.toISOString(),
        planEndDate: planEndDate.toISOString()
      };
    }
    else if (billingCycle === "freeTrial" && plan === "freeTrial") {
      sessionLimit = 1; 
      planStartDate = new Date();
      planEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);   
      paymentDetails = {
        sessions: sessionLimit,
        sessionType,
        billingCycle,
        planName: selectedPlan.name,
        planStartDate: planStartDate.toISOString(),
        planEndDate: planEndDate.toISOString()
      };
    }

    // Update student model for ALL plan types
    student.selectedPlan = plan;
    student.billingCycle = billingCycle;
    student.sessionType = sessionType;
    student.sessionLimit = sessionLimit;
    student.sessionUsed = 0;
    student.planStartDate = planStartDate;
    student.planEndDate = planEndDate;
    
    // Set payment status based on plan type
    if (billingCycle === "freeTrial") {
      student.paymentStatus = "not required";
    } else {
      student.paymentStatus = "pending";
    }
    
    await student.save();
    
    return NextResponse.json({
      success: true,
      student: student,
      planStartDate: planStartDate.toISOString(),
      planEndDate: planEndDate.toISOString(),
      paymentDetails,
    });

  } catch (error) {
    console.error("Error selecting plan:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}