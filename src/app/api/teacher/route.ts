import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import Teacher from "@/models/teacherModel";
import ClassModel from "@/models/classModel";
import SubjectModel from "@/models/subjectModel";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import os from "os";
import moment from "moment-timezone";

// Helper to get UTC time range from local slot
function convertToUtcSlot(slot: any, date: string, timezone: string) {
  const [startStr, endStr] = slot.localTime.split("-");
  const start = moment.tz(`${date} ${startStr}`, "YYYY-MM-DD hh:mmA", timezone);
  const end = moment.tz(`${date} ${endStr}`, "YYYY-MM-DD hh:mmA", timezone);
  return {
    date,
    localTime: slot.localTime,
    utcTime: `${start.utc().toISOString()}-${end.utc().toISOString()}`,
  };
}

function getCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await req.formData();

    const file = formData.get("profileImage") as File | null;
    const timezone = formData.get("timezone")?.toString() || "Asia/Kolkata";
    const rawAssignments = JSON.parse(formData.get("assignments") as string);
    const rest = Object.fromEntries(formData.entries());

    const password = rest.password?.toString();
    if (!password) {
      return NextResponse.json({ msg: "Password is required" }, { status: 400 });
    }
    delete rest.password;

    let imageUrl = "";
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);
      const result = await cloudinary.uploader.upload(tempPath, { folder: "teacher_profiles" });
      imageUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const classNames = rawAssignments.map((a: any) => a.classes);
    const subjectNames = rawAssignments.map((a: any) => a.subjects);
    const classDocs = await ClassModel.find({ name: { $in: classNames } });
    const subjectDocs = await SubjectModel.find({ name: { $in: subjectNames } });

    const assignments = rawAssignments.flatMap((a: any) => {
      return a.slots.map((s: any) => ({
        classes: a.classes,
        subjects: a.subjects,
        slots: [convertToUtcSlot(s, s.date, timezone)],
      }));
    });

    const createdTeacher = await Teacher.create({
      ...rest,
      password: hashedPassword,
      profileImage: imageUrl,
      role: "Teacher",
      assignments,
      classes: classDocs.map((c) => c._id),
      subjects: subjectDocs.map((s) => s._id),
    });

    const populated = await Teacher.findById(createdTeacher._id)
      .select("-password")
      .populate("classes", "name")
      .populate("subjects", "name");

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
    const file = formData.get("profileImage") as File | null;
    const removeImage = formData.get("removeImage") === "true";
    const timezone = formData.get("timezone")?.toString() || "Asia/Kolkata";
    const rawAssignments = JSON.parse(formData.get("assignments") as string);
    const rest = Object.fromEntries(formData.entries());

    const teacher = await Teacher.findById(id);
    if (!teacher) return NextResponse.json({ msg: "Teacher not found" }, { status: 404 });

    let imageUrl = teacher.profileImage;
    if (file && file.name) {
      if (imageUrl) {
        const publicId = getCloudinaryPublicId(imageUrl);
        if (publicId) await cloudinary.uploader.destroy(`teacher_profiles/${publicId}`);
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);
      const result = await cloudinary.uploader.upload(tempPath, { folder: "teacher_profiles" });
      imageUrl = result.secure_url;
      fs.unlinkSync(tempPath);
    } else if (removeImage && imageUrl) {
      const publicId = getCloudinaryPublicId(imageUrl);
      if (publicId) await cloudinary.uploader.destroy(`teacher_profiles/${publicId}`);
      imageUrl = "";
    }

    const password = rest.password?.toString();
    if (password) {
      rest.password = await bcrypt.hash(password, 10);
    } else {
      delete rest.password;
    }

    const classNames = rawAssignments.map((a: any) => a.classes);
    const subjectNames = rawAssignments.map((a: any) => a.subjects);

    const classDocs = await ClassModel.find({ name: { $in: classNames } });
    const subjectDocs = await SubjectModel.find({ name: { $in: subjectNames } });

    const assignments = rawAssignments.flatMap((a: any) => {
      return a.slots.map((s: any) => ({
        classes: a.classes,
        subjects: a.subjects,
        slots: [convertToUtcSlot(s, s.date, timezone)],
      }));
    });

    const updated = await Teacher.findByIdAndUpdate(
      id,
      {
        ...rest,
        profileImage: imageUrl,
        assignments,
        classes: classDocs.map((c) => c._id),
        subjects: subjectDocs.map((s) => s._id),
      },
      { new: true }
    )
      .select("-password")
      .populate("classes", "name")
      .populate("subjects", "name");

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
      .select("-password")
      .populate("classes", "name")
      .populate("subjects", "name");
    return NextResponse.json({ teachers }, { status: 200 });
  } catch (err) {
    console.error("Get Teachers Error:", err);
    return NextResponse.json({ msg: "Fetch failed", error: err }, { status: 500 });
  }
}