import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import '@/models/parent';
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
      if (student.parent && typeof (student.parent as any).toObject === 'function') {
  const parentDoc = student.parent as any;
  const parentId = parentDoc._id.toString();

  if (!uniqueParentsMap.has(parentId)) {
    const parentData = parentDoc.toObject();
    parentData.student = [student];
    uniqueParentsMap.set(parentId, parentData);
  } else {
    uniqueParentsMap.get(parentId).student.push(student);
  }
}
    });

    const parents = Array.from(uniqueParentsMap.values());
    return NextResponse.json(parents, { status: 200 });
  } catch (error) {
    console.error('Error fetching parents by student:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
