import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import Teacher from "@/models/teacherModel";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import os from "os";

function getCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await req.formData();
    const rest = Object.fromEntries(formData.entries());

    const profileFile = formData.get("profileImage") as File | null;
    const resumeFile = formData.get("resume") as File | null;

    const password = rest.password?.toString();
    if (!password) {
      return NextResponse.json({ msg: "Password is required" }, { status: 400 });
    }
    delete rest.password;

    let imageUrl = "";
    if (profileFile && profileFile.name) {
      const bytes = Buffer.from(await profileFile.arrayBuffer());
      const tempPath = path.join(os.tmpdir(), profileFile.name);
      await writeFile(tempPath, bytes);
      const result = await cloudinary.uploader.upload(tempPath, { folder: "teacher_profiles" });
      imageUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    }

    let resumeUrl = "";
    if (resumeFile && resumeFile.name) {
      const bytes = Buffer.from(await resumeFile.arrayBuffer());
      const tempPath = path.join(os.tmpdir(), resumeFile.name);
      await writeFile(tempPath, bytes);
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: "teacher_resumes",
        resource_type: "raw", 
      });
      resumeUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdTeacher = await Teacher.create({
      ...rest,
      password: hashedPassword,
      profileImage: imageUrl,
      resume: resumeUrl, 
      role: "Teacher",
    });

    const populated = await Teacher.findById(createdTeacher._id).select("-password");

    return NextResponse.json({ msg: "Teacher created", teacher: populated }, { status: 201 });
  } catch (err) {
    console.error("Create Teacher Error:", err);
    return NextResponse.json({ msg: "Creation failed", error: err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ msg: "Teacher ID missing" }, { status: 400 });

    const formData = await req.formData();
    const profileFile = formData.get("profileImage") as File | null;
    const resumeFile = formData.get("resume") as File | null;
    const removeImage = formData.get("removeImage") === "true";
    const removeResume = formData.get("removeResume") === "true";
    const rest = Object.fromEntries(formData.entries());

    const teacher = await Teacher.findById(id);
    if (!teacher) return NextResponse.json({ msg: "Teacher not found" }, { status: 404 });

    // Handle Profile Image
    let imageUrl = teacher.profileImage;
    if (profileFile && profileFile.name) {
      if (imageUrl) {
        const publicId = getCloudinaryPublicId(imageUrl);
        if (publicId) await cloudinary.uploader.destroy(`teacher_profiles/${publicId}`);
      }
      const bytes = Buffer.from(await profileFile.arrayBuffer());
      const tempPath = path.join(os.tmpdir(), profileFile.name);
      await writeFile(tempPath, bytes);
      const result = await cloudinary.uploader.upload(tempPath, { folder: "teacher_profiles" });
      imageUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    } else if (removeImage && imageUrl) {
      const publicId = getCloudinaryPublicId(imageUrl);
      if (publicId) await cloudinary.uploader.destroy(`teacher_profiles/${publicId}`);
      imageUrl = "";
    }

    // Handle Resume
    let resumeUrl = teacher.resume;
    if (resumeFile && resumeFile.name) {
      if (resumeUrl) {
        const publicId = getCloudinaryPublicId(resumeUrl);
        if (publicId) await cloudinary.uploader.destroy(`teacher_resumes/${publicId}`);
      }
      const bytes = Buffer.from(await resumeFile.arrayBuffer());
      const tempPath = path.join(os.tmpdir(), resumeFile.name);
      await writeFile(tempPath, bytes);
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: "teacher_resumes",
        resource_type: "raw",
      });
      resumeUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    } else if (removeResume && resumeUrl) {
      const publicId = getCloudinaryPublicId(resumeUrl);
      if (publicId) await cloudinary.uploader.destroy(`teacher_resumes/${publicId}`);
      resumeUrl = "";
    }

    // Handle Password
    const password = rest.password?.toString();
    if (password) {
      rest.password = await bcrypt.hash(password, 10);
    } else {
      delete rest.password;
    }

    const updated = await Teacher.findByIdAndUpdate(
      id,
      { ...rest, profileImage: imageUrl, resume: resumeUrl },
      { new: true }
    ).select("-password");

    return NextResponse.json({ msg: "Teacher updated", teacher: updated }, { status: 200 });
  } catch (err) {
    console.error("Update Teacher Error:", err);
    return NextResponse.json({ msg: "Update failed", error: err }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const teachers = await Teacher.find()
      .select("-password");
    return NextResponse.json({ teachers }, { status: 200 });
  } catch (err) {
    console.error("Get Teachers Error:", err);
    return NextResponse.json({ msg: "Fetch failed", error: err }, { status: 500 });
  }
}