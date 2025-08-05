import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Booking from '@/models/bookingModel'; 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentIds = searchParams.getAll('studentIds');

  if (!studentIds || studentIds.length === 0) {
    return NextResponse.json({ error: 'Missing studentIds' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const sessions = await Booking.find({
      studentId: { $in: studentIds },
      start: { $gte: todayStart, $lte: todayEnd },
      status: 'booked'
    });

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch today sessions', details: err }, { status: 500 });
  }
}
