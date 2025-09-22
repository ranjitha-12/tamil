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
    const address: any = {};
    
    // Process all form data fields
    for (const [key, value] of formData.entries()) {
      if (key === "profileImage") continue;

      // Handle address fields with bracket notation (address[street], address[city], etc.)
      if (key.startsWith("address[")) {
        const addrKey = key.match(/address\[(.*?)\]/)?.[1];
        if (addrKey) {
          address[addrKey] = value.toString();
        }
      } 
      // Handle address fields with dot notation (address.street, address.city, etc.)
      else if (key.startsWith("address.")) {
        const addrKey = key.split('.')[1];
        address[addrKey] = value.toString();
      }
      else {
        updates[key] = value.toString();
      }
    }
    
    // Only add address to updates if we have address data
    if (Object.keys(address).length > 0) {
      // FIX: Handle case where existingParent.address might be undefined
      updates.address = existingParent.address 
        ? { ...existingParent.address.toObject(), ...address }
        : address;
    }

    // Handle profile image upload
    if (file && file.name && file.size > 0) {
      if (existingParent.profileImage) {
        const publicId = getCloudinaryPublicId(existingParent.profileImage);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`parent_profiles/${publicId}`);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);
      
      try {
        const result = await cloudinary.uploader.upload(tempPath, {
          folder: 'parent_profiles',
        });
        updates.profileImage = result.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      } finally {
        try {
          fs.unlinkSync(tempPath);
        } catch (error) {
          console.error('Error deleting temp file:', error);
        }
      }
    }

    console.log('Updates to be applied:', updates); // Debug log

    const updatedParent = await Parent.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedParent);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update parent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
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
