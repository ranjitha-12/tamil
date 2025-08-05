import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Attendance from '@/models/attendanceModel';
import Booking from '@/models/bookingModel';
import Student from '@/models/studentModel';
import Class from '@/models/classModel';

export async function GET(req: NextRequest) {
  const teacherId = req.nextUrl.searchParams.get('teacherId');
  if (!teacherId) {
    return NextResponse.json({ error: 'Missing teacherId' }, { status: 400 });
  }

  try {
    await connectMongoDB();
    const bookings = await Booking.find({ teacherId }).select('_id');
    const bookingIds = bookings.map((b) => b._id);

    const attendances = await Attendance.find({ booking: { $in: bookingIds } })
      .populate({
        path: 'student',
        select: 'name surname email grade',populate: {
          path: 'grade',
          select: '_id name'
        }
      })
      .populate({
        path: 'booking',
        select: 'start end title'
      })
      .lean();

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error('GET Attendance Error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}
