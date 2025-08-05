import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent from '@/models/parent';
import Student from '@/models/studentModel';
import FreeTrial from '@/models/freeTrialModel';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Missing parent email' }, { status: 400 });

    await connectMongoDB();
    const exists = await FreeTrial.exists({ parentEmail: email });
    return NextResponse.json({ used: !!exists });
  } catch (error) {
    return NextResponse.json({ error: 'GET failed', details: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { parentId, studentId } = await req.json();
    if (!parentId || !studentId) {
      return NextResponse.json({ error: 'Missing parentId or studentId' }, { status: 400 });
    }

    await connectMongoDB();

    const parent = await Parent.findById(parentId).lean() as unknown as { email: string; _id: string };
    if (!parent || !parent.email) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    const hasUsed = await FreeTrial.exists({ parentEmail: parent.email });
    if (hasUsed) {
      return NextResponse.json({ error: 'Free trial already used' }, { status: 403 });
    }

    const match = await Student.exists({ _id: studentId, parent: parent._id });
    if (!match) return NextResponse.json({ error: 'Student mismatch' }, { status: 403 });

    const trial = new FreeTrial({ parentEmail: parent.email, studentId });
    await trial.save();

    return NextResponse.json({ message: 'Free trial booked!' });
  } catch (error) {
    return NextResponse.json({ error: 'POST failed', details: error }, { status: 500 });
  }
}