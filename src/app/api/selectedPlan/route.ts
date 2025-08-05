import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent from '@/models/parent';
import Student from '@/models/studentModel';
import SubscriptionPlan from '@/models/subscriptionModel';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const { plan, parentId, studentId } = body;

    if (!plan || !parentId || !studentId) {
      return NextResponse.json(
        { success: false, message: 'Missing plan, parentId, or studentId' },
        { status: 400 }
      );
    }

    const parent = await Parent.findById(parentId);
    if (!parent) {
      return NextResponse.json(
        { success: false, message: 'Parent not found' },
        { status: 404 }
      );
    }

    const studentExists = parent.students?.some(
      (s: any) => s.toString() === studentId
    );
    if (!studentExists) {
      return NextResponse.json(
        { success: false, message: 'Student does not belong to this parent' },
        { status: 403 }
      );
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Restrict free plan reuse
    if (student.selectedPlan === 'free' && plan === 'free') {
      return NextResponse.json(
        {
          success: false,
          message: 'Free plan already used for this student. Please choose a paid plan.',
        },
        { status: 403 }
      );
    }

    // Prevent downgrading
    if (student.selectedPlan && student.selectedPlan !== 'free' && plan === 'free') {
      return NextResponse.json(
        {
          success: false,
          message: 'Free plan is only allowed for first-time use.',
        },
        { status: 403 }
      );
    }

    const selectedPlan = await SubscriptionPlan.findOne({ value: plan });
    if (!selectedPlan) {
      return NextResponse.json(
        { success: false, message: 'Subscription plan not found.' },
        { status: 404 }
      );
    }

    // Define session limit and calculate end date
    let sessionLimit = 1;
    const now = new Date();
    let planEndDate = new Date(now); 
    switch (plan) {
      case 'hourly':
      case 'free':
        sessionLimit = 1;
        planEndDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); 
        break;
      case 'monthly':
        sessionLimit = 21;
        planEndDate.setMonth(planEndDate.getMonth() + 1);
        break;
      case 'threemonth':
        sessionLimit = 63;
        planEndDate.setMonth(planEndDate.getMonth() + 3);
        break;
      case 'sixmonth':
        sessionLimit = 126;
        planEndDate.setMonth(planEndDate.getMonth() + 6);
        break;
      case 'yearly':
        sessionLimit = 252;
        planEndDate.setFullYear(planEndDate.getFullYear() + 1);
        break;
      default:
        sessionLimit = 1;
        planEndDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); 
    }

    // Update student
    student.selectedPlan = plan;
    student.sessionLimit = sessionLimit;
    student.sessionUsed = 0;
    student.planStartDate = now;
    student.planEndDate = planEndDate;
    student.paymentStatus = plan === 'free' ? 'not required' : 'pending';

    await student.save();

    return NextResponse.json({
      success: true,
      message: `Plan '${plan}' selected successfully.`,
      student,
    });
  } catch (error) {
    console.error('Error selecting plan:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}