import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Assignment from "@/models/assignmentModel";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await req.formData();
    const assignmentId = formData.get("assignmentId") as string;
    const file = formData.get("studentFile") as File;
    if (!assignmentId || !file) {
      return NextResponse.json(
        { error: "Assignment ID and file are required" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "assignment_submissions",
      resource_type: "auto",
    });
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }
    if (!assignment.attachments) {
      assignment.attachments = { teacherFiles: [], studentFiles: [] };
    } else if (!assignment.attachments.studentFiles) {
      assignment.attachments.studentFiles = [];
    }
    assignment.attachments.studentFiles.push({
      fileName: file.name,
      fileUrl: uploadResult.secure_url,
      uploadedAt: new Date(),
    });
    assignment.status = "COMPLETED";
    assignment.submissionDate = new Date();
    await assignment.save();
    return NextResponse.json(
      { message: "Assignment submitted", assignment },
      { status: 200 }
    );
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
