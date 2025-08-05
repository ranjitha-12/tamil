import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import ResetToken from '@/models/resetTokenModel';
import User from '@/models/parent';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await connectMongoDB();
  const { token, password } = await req.json();

  const resetRecord = await ResetToken.findOne({ token });
  if (!resetRecord || resetRecord.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email: resetRecord.email }, { password: hashedPassword });
  await ResetToken.deleteOne({ token });

  return NextResponse.json({ message: 'Password updated successfully' });
}