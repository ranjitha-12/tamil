import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent from '@/models/parent';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, whatsapp, password, role, country } = await req.json();

    if (!email || !whatsapp || !password || !role || !country) {
      return NextResponse.json({ message: "All required fields must be filled" }, { status: 400 });
    }

    await connectMongoDB();

    const existing = await Parent.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Parent already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newParent = new Parent({
      email,
      whatsapp,
      password: hashedPassword,
      role,
      country,
      paymentStatus: 'pending',
    });

    await newParent.save();

    return NextResponse.json({ message: "Parent registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}