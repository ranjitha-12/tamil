import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Feedback from '@/models/feedbackModel';
import Teacher from '@/models/teacherModel';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();

    const {
      parentId,
      parentName,
      studentName,
      teacherId,
      rating,
      discussionSummary,
      feedbackText,
      suggestions,
    } = body;

    if (!parentId || !parentName || !studentName || !teacherId || !rating || !discussionSummary || !feedbackText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFeedback = await Feedback.create({
      parentId,
      parentName,
      studentName,
      teacherId,
      rating,
      discussionSummary,
      feedbackText,
      suggestions,
    });

    return NextResponse.json({success: true, message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error('POST Feedback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const parentId = req.nextUrl.searchParams.get('parentId');

    const filter: any = {};
    if (parentId) filter.parentId = parentId;

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'teacherId',
        select: 'name surname country state profileImage', 
        model: Teacher 
      });

    return NextResponse.json({ 
      success: true, 
      feedbacks: feedbacks.map(fb => ({
        ...fb.toObject(),
        teacher: {
          name: fb.teacherId?.name || 'Unknown',
          surname: fb.teacherId?.surname || '',
          state: fb.teacherId?.state || '',
          country: fb.teacherId?.country || '',
          profileImage: fb.teacherId?.profileImage || ''
        }
      }))
    });
  } catch (error) {
    console.error('GET Feedback error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}
