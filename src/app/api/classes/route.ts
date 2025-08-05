import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import ClassModel from '@/models/classModel';

// GET: Fetch all classes
export async function GET() {
  try {
    await connectMongoDB();
    const classes = await ClassModel.find()
    return NextResponse.json(classes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

// POST: Create a new class
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const data = await req.json();
    const newClass = await ClassModel.create(data);
    return NextResponse.json(newClass, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}

// PUT: Update an existing class
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing class ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();
    const data = await req.json();
    const updatedClass = await ClassModel.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedClass);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
  }
}

// DELETE: Delete a class
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing class ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();
    await ClassModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}
