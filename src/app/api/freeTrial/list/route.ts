import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import FreeTrial from '@/models/freeTrialModel';
import Student from '@/models/studentModel';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const freeTrials = await FreeTrial.find()
      .populate({
        path: 'studentId',
        model: Student,
        populate: { path: 'grade' },
      })
      .lean();

    const mapped = freeTrials.map((t: any) => ({
      _id: t._id,
      parentEmail: t.parentEmail,
      student: {
        _id: t.studentId?._id,
        name: t.studentId?.name,
        surname: t.studentId?.surname,
        grade: t.studentId?.grade,
      },
      bookedAt: t.bookedAt,
    }));

    return NextResponse.json({ freeTrials: mapped });
  } catch (error) {
    console.error('Fetch FreeTrial error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
