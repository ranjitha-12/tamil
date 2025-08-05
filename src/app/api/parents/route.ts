import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent from "@/models/parent";
import Student from "@/models/studentModel";
import cloudinary from '@/lib/cloudinary';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import fs from 'fs';

function getCloudinaryPublicId(url: string): string | null {
  const regex = /\/v\d+\/(.+)\.[a-z]+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const parents = await Parent.find().lean();
    const allStudentIds = parents.flatMap(parent => parent.students);
    const students = await Student.find({ _id: { $in: allStudentIds } }).lean();
    return NextResponse.json({
      parents,
      students,
    });

  } catch (error) {
    console.error('Error fetching parents and students:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// UPDATE a parent
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing parent ID' }, { status: 400 });

  try {
    await connectMongoDB();
    const formData = await req.formData();
    const file = formData.get('profileImage') as File;

    const existingParent = await Parent.findById(id);
    if (!existingParent) return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    const updates: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "profileImage") {
        updates[key] = value;
      }
    }
    if (file && file.name) {
      if (existingParent.profileImage) {
        const publicId = getCloudinaryPublicId(existingParent.profileImage);
        if (publicId) await cloudinary.uploader.destroy(`parent_profiles/${publicId}`);
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: 'parent_profiles',
      });
      updates.profileImage = result.secure_url;
      fs.unlinkSync(tempPath);
    }

    const updatedParent = await Parent.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(updatedParent);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update parent' }, { status: 500 });
  }
}

// DELETE a parent
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing parent ID' }, { status: 400 });
  }
  try {
    await connectMongoDB();
    const deletedParent = await Parent.findByIdAndDelete(id);
    if (!deletedParent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }
    // 2. Delete associated students
    await Student.deleteMany({ parent: id });
    return NextResponse.json({ message: 'Parent and associated students deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete parent and students' }, { status: 500 });
  }
}
