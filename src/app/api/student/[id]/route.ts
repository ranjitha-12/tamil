import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Student from '@/models/studentModel';

export async function GET(
  req: NextRequest,
  { params } : { params: Promise<{ id: string }> }
) {
  const { id } = await params;

   try {
    await connectMongoDB();
     const student = await Student.findById(id).populate("parent");
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params } : { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectMongoDB();
    const body = await req.json();
    const { profileStatus, enrollmentCategory } = body;

    const updated = await Student.findByIdAndUpdate(
      id,
      { $set: { profileStatus, enrollmentCategory } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}