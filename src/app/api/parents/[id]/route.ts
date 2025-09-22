import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent, { ParentInterface } from '@/models/parent';
import Student from '@/models/studentModel';
import '@/models/classModel'; 

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing parent ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const parent = await Parent.findById(id).lean<ParentInterface>();

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }
    const studentIds = parent.students ?? [];

    const students = await Student.find({ _id: { $in: studentIds } })
      .populate('grade', 'name')
      .select('name surname email grade selectedPlan paymentStatus')
      .lean();

    return NextResponse.json({ ...parent, students });
  } catch (error) {
    console.error('Fetch parent error:', error);
    return NextResponse.json({ error: 'Failed to fetch parent' }, { status: 500 });
  }
}