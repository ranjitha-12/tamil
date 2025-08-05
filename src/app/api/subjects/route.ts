import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Subject from '@/models/subjectModel'; 

// GET all subjects
export async function GET() {
  try {
    await connectMongoDB();
    const subjects = await Subject.find().populate('teachers');
    return NextResponse.json(subjects);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

// POST: Create subject
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const data = await req.json();
    const newSubject = await Subject.create(data);
    return NextResponse.json(newSubject, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}

// PUT: Update subject
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing subject ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();
    const data = await req.json();
    const updated = await Subject.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 });
  }
}

// DELETE: Remove subject
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing subject ID' }, { status: 400 });
  }
  try {
    await connectMongoDB();
    await Subject.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 });
  }
}
