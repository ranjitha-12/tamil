import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Student from '@/models/studentModel';

export async function GET() {
  try {
    await connectMongoDB();

    const studentCount = await Student.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
          _id: 0,
        },
      },
    ]);

    return NextResponse.json(studentCount);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch student stats' }, { status: 500 });
  }
}
