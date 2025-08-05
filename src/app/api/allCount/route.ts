import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent from '@/models/parent';
import Student from '@/models/studentModel';
import Teacher from '@/models/teacherModel';

export async function GET() {
  try {
    await connectMongoDB();

    const [parentCount, studentCount, teacherCount] = await Promise.all([
      Parent.countDocuments(),
      Student.countDocuments(),
      Teacher.countDocuments()
    ]);

    const result = [
      { name: 'Parents', value: parentCount },
      { name: 'Students', value: studentCount },
      { name: 'Teachers', value: teacherCount }
    ];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch all counts:', error);
    return NextResponse.json({ error: 'Failed to fetch all counts' }, { status: 500 });
  }
}
