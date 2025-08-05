import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Student from '@/models/studentModel';

export async function GET(
  req: NextRequest,
   { params } : { params: Promise<{ id: string }> }
) { const { id } = await params;
  try { 
    await connectMongoDB();
    const student = await Student.findById(id).populate('grade', 'name');
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}
