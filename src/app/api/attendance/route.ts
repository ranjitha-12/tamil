import { NextRequest, NextResponse } from 'next/server'; 
import { connectMongoDB } from '@/lib/mongodb';
import Attendance from '@/models/attendanceModel';
import Booking from '@/models/bookingModel';
import Student from '@/models/studentModel';
import Teacher from '@/models/teacherModel';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { studentId, bookingId, status, lateDuration } = await req.json();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const existingAttendance = await Attendance.findOne({ booking: bookingId, student: studentId });
    if (existingAttendance) {
      return NextResponse.json({ error: 'Attendance already marked' }, { status: 400 });
    }

    const date = new Date(booking.start);
    const newAttendance = await Attendance.create({
      student: studentId,
      booking: bookingId,
      date,
      status,
      lateDuration: status === "LATE" ? lateDuration : undefined,
    });

    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { attendance: newAttendance._id },
    });

    const teacherId = booking.teacherId;
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      const updatedCount = (teacher?.attendanceCount || 0) + 1;
      await Teacher.findByIdAndUpdate(teacherId, { attendanceCount: updatedCount });
    }

    return NextResponse.json(
      { message: 'Attendance marked', attendance: newAttendance },
      { status: 201 }
    );
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const studentId = req.nextUrl.searchParams.get('studentId');
    const teacherId = req.nextUrl.searchParams.get('teacherId');
    let filter: any = {};

    if (studentId) filter.student = studentId;

    if (teacherId) {
      const bookings = await Booking.find({ teacherId }).select('_id');
      const bookingIds = bookings.map((b) => b._id);
      filter.booking = { $in: bookingIds };
    }

    const attendances = await Attendance.find(filter)
      .populate('booking')
      .populate({
        path: 'student',
        populate: { path: 'grade', select: 'name' },
      });

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error("GET Attendance Error:", error);
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}