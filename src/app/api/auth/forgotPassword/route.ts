import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import ResetToken from '@/models/resetTokenModel';
import User from '@/models/parent';
import crypto from 'crypto';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: NextRequest) {
  await connectMongoDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await ResetToken.create({ email, token, expires });
  const resetLink = `${process.env.NEXTAUTH_URL}/changePassword?token=${token}`;

  const success = await sendEmail(email, resetLink);
  if (!success) return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });

  return NextResponse.json({ message: 'Reset link sent' });
}