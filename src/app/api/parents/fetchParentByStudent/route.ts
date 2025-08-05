import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent from '@/models/parent';
import Student from '@/models/studentModel';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const studentIdsParam = req.nextUrl.searchParams.get('studentIds');
    if (!studentIdsParam) {
      return NextResponse.json({ message: 'Student IDs are required' }, { status: 400 });
    }

    const studentIds = studentIdsParam.split(',');

    // Fetch students and populate their parent
    const students = await Student.find({ _id: { $in: studentIds } }).populate('parent');

    // Collect unique parents
    const uniqueParentsMap = new Map();
    students.forEach(student => {
      if (student.parent && !uniqueParentsMap.has(student.parent._id.toString())) {
        const parentData = student.parent.toObject();
        parentData.student = [student]; // initialize
        uniqueParentsMap.set(parentData._id.toString(), parentData);
      } else if (student.parent) {
        uniqueParentsMap.get(student.parent._id.toString()).student.push(student);
      }
    });

    const parents = Array.from(uniqueParentsMap.values());
    return NextResponse.json(parents, { status: 200 });
  } catch (error) {
    console.error('Error fetching parents by student:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
