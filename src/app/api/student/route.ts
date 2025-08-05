import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Student from "@/models/studentModel";
import Parent from "@/models/parent";
import "@/models/classModel";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import fs from "fs";
function getCloudinaryPublicId(url: string): string | null {
  const regex = /\/v\d+\/(.+)\.\w+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    await connectMongoDB();
    const students = await Student.find().populate("grade", "name").populate("parent");
    return NextResponse.json(students);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await req.formData();
    const parent = formData.get("parent");
    const name = formData.get("name");
    const surname = formData.get("surname");
    const email = formData.get("email");
    const age = Number(formData.get("age"));
    const grade = formData.get("grade");
    const sex = formData.get("sex");
    const birthday = formData.get("birthday");
    const file: File | null = formData.get("profileImage") as File;
    if (!parent) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }
    const parentExists = await Parent.findById(parent);
    if (!parentExists) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }
    let imageUrl = "";
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: "student_profiles",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    }
    const newStudent = await Student.create({
      name,
      surname,
      email,
      age,
      grade,
      sex,
      birthday,
      parent,
      profileImage: imageUrl,
    });
    await Parent.findByIdAndUpdate(parent, {
      $addToSet: { students: newStudent._id },
    });
    return NextResponse.json(newStudent, { status: 201 });
  } catch (err) {
    console.error("Error creating student:", err);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing student ID" }, { status: 400 });
    }
    const formData = await req.formData();
    const name = formData.get("name");
    const surname = formData.get("surname");
    const email = formData.get("email");
    const age = Number(formData.get("age"));
    const grade = formData.get("grade");
    const sex = formData.get("sex");
    const birthday = formData.get("birthday");
    const parent = formData.get("parent");
    const file: File | null = formData.get("profileImage") as File;
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    let imageUrl = existingStudent.profileImage;

    if (file && file.name) {
      if (imageUrl) {
        const publicId = getCloudinaryPublicId(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`student_profiles/${publicId}`);
        }
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: "student_profiles",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    } else if (!file && !formData.get("existingProfileImage")) {
      if (imageUrl) {
        const publicId = getCloudinaryPublicId(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`student_profiles/${publicId}`);
        }
        imageUrl = "";
      }
    }
    const updatedStudent = await Student.findByIdAndUpdate(id, {
      name,
      surname,
      email,
      age,
      grade,
      sex,
      birthday,
      parent,
      profileImage: imageUrl,
    }, { new: true });
    const oldParentId = existingStudent.parent?.toString();
    if (oldParentId !== parent) {
      if (oldParentId) {
        await Parent.findByIdAndUpdate(oldParentId, { $pull: { students: id } });
      }
      await Parent.findByIdAndUpdate(parent, { $addToSet: { students: id } });
    }
    return NextResponse.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing student ID" }, { status: 400 });
  }
  try {
    await connectMongoDB();
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (student.profileImage) {
      const publicId = getCloudinaryPublicId(student.profileImage);
      if (publicId) {
        await cloudinary.uploader.destroy(`student_profiles/${publicId}`);
      }
    }
    await Parent.findByIdAndUpdate(student.parent, { $pull: { students: id } });
    return NextResponse.json({ message: "Student deleted and parent updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}