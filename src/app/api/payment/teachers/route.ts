import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Payment from '@/models/teacherPaymentModel';
import Attendance from '@/models/attendanceModel';
import Teacher from '@/models/teacherModel';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { teacherId, attendanceCount, amount } = await req.json();

    if (!teacherId || attendanceCount === undefined || amount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Save payment record
    const payment = await Payment.create({
      teacher: teacherId,
      attendanceCount,
      amount,
      month,
      year,
      paidAt: now,
    });

    // Reset attendanceCount for the teacher (only for UI purposes; actual record in Attendance collection)
    await Teacher.findByIdAndUpdate(teacherId, {
      attendanceCount: 0,
    });

    return NextResponse.json({ message: 'Payment successful', payment }, { status: 200 });
  } catch (err) {
    console.error('Payment error:', err);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}