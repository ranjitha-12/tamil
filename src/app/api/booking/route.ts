import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Booking from '@/models/bookingModel';
import Student from '@/models/studentModel';
import Teacher from '@/models/teacherModel';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const teacherId = req.nextUrl.searchParams.get('teacherId');
    let bookings;
    if (teacherId) {
      bookings = await Booking.find({ teacherId })
        .populate({
          path: 'studentId',
          select: 'name surname',
          model: Student
        });
    } else {
      bookings = await Booking.find()
        .populate({
          path: 'studentId',
          select: 'name surname', 
          model: Student
        });
    }
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("GET Bookings Error:", error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { studentId, teacherId, title, start, end } = await req.json();
    if (!studentId || !teacherId || !start || !end || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    if ((student.sessionUsed ?? 0) >= (student.sessionLimit ?? 1)) {
      return NextResponse.json(
        { error: 'Session limit reached. Upgrade your plan to book more classes.' },
        { status: 403 }
      );
    }
    const existing = await Booking.findOne({
      studentId,
      start: new Date(start),
    });
    if (existing) {
      return NextResponse.json(
        { error: 'This slot is already booked.' },
        { status: 409 }
      );
    }
    const booking = await Booking.create({
      studentId,
      teacherId,
      title,
      start: new Date(start),
      end: new Date(end),
      status: 'booked',
    });
    student.sessionUsed = (student.sessionUsed ?? 0) + 1;
    await student.save();

    await Teacher.findByIdAndUpdate(
      teacherId,
      {
        $addToSet: { students: studentId } 
      },
      { new: true }
    );
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'studentId',
        select: 'name surname',
        model: Student
      })
      .populate({
        path: 'teacherId',
        select: 'name surname',
        model: Teacher
      });

    return NextResponse.json({ 
      success: true, 
      booking: populatedBooking,
      message: 'Booking created and teacher updated successfully'
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}