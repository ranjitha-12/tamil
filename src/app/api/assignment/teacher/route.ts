import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Assignment from "@/models/assignmentModel";
import Student from "@/models/studentModel";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const form = await req.formData();
    const title = form.get("title") as string;
    const description = form.get("description") as string;
    const dueDate = new Date(form.get("dueDate") as string);
    const teacherId = form.get("teacher") as string;
    const studentId = form.get("student") as string;
    const file = form.get("attachments") as File;
    const newAssign = new Assignment({
      title,
      description,
      dueDate,
      teacher: teacherId,
      student: studentId,
      attachments: {
        teacherFiles: [],
        studentFiles: []
      }
    });
    if (file && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const tempFilePath = path.join(os.tmpdir(), file.name);
      await writeFile(tempFilePath, buffer);
      const resC = await cloudinary.uploader.upload(tempFilePath, {
        folder: "assignment_files",
        resource_type: "raw",
      });
      fs.unlinkSync(tempFilePath);
      newAssign.attachments.teacherFiles.push({
        fileName: file.name,
        fileUrl: resC.secure_url,
        uploadedAt: new Date(),
      });
    }
    await newAssign.save();
    await Student.findByIdAndUpdate(studentId, {
      $push: { assignment: newAssign._id },
    });
    return NextResponse.json(
      { message: "Assignment created", assignment: newAssign },
      { status: 201 }
    );
  } catch (err) {
    console.error("Assignment creation error:", err);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
