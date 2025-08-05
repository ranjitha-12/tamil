import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Announcement from '@/models/announcementModel';
import Student from '@/models/studentModel';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { title, description, date, classId } = await req.json();
    if (!title || !description || !date || !classId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    const newAnnouncement = await Announcement.create({
      title,
      description,
      date,
      class: classId,
    });
    const students = await Student.find({ grade: classId }); 
    const updatePromises = students.map((student) =>
      Student.findByIdAndUpdate(
        student._id,
        { $addToSet: { announcements: newAnnouncement._id } }, 
        { new: true }
      )
    );
    await Promise.all(updatePromises);
    return NextResponse.json({ success: true, data: newAnnouncement });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const announcements = await Announcement.find()
      .populate("class", "name")
      .sort({ date: -1 });

    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// DELETE Announcement and remove from Student arrays
export async function DELETE(req: NextRequest) {
  try {
    await connectMongoDB();
    const announcementId = req.nextUrl.searchParams.get('id');
    if (!announcementId) {
      return NextResponse.json({ success: false, error: "Announcement ID is required" }, { status: 400 });
    }
    const deletedAnnouncement = await Announcement.findByIdAndDelete(announcementId);
    if (!deletedAnnouncement) {
      return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
    }
    await Student.updateMany(
      { announcements: announcementId },
      { $pull: { announcements: announcementId } }
    );

    return NextResponse.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
