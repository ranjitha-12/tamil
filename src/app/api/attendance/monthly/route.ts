import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Attendance from '@/models/attendanceModel';
import Booking from '@/models/bookingModel';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const teacherId = req.nextUrl.searchParams.get('teacherId');
    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return NextResponse.json({ error: 'Invalid or missing teacherId' }, { status: 400 });
    }

    // 1. Get all bookings of this teacher
    const bookings = await Booking.find({ teacherId }).select('_id');
    const bookingIds = bookings.map((b) => b._id);

    if (bookingIds.length === 0) {
      return NextResponse.json({ data: [] }); 
    }

    // 2. Aggregate attendance by those bookings, grouped by year + month
    const monthlyCounts = await Attendance.aggregate([
      {
        $match: {
          booking: { $in: bookingIds },
        },
      },
      {
        $project: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
      },
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
    ]);

    return NextResponse.json({ data: monthlyCounts });
  } catch (err) {
    console.error('Monthly attendance error:', err);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}