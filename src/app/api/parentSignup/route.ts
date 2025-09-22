import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Parent from '@/models/parent';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, whatsapp, password, role, country, countryCode } = await req.json();
    
    // Validate required fields
    if (!email || !whatsapp || !password || !role || !country || !countryCode) {
      return NextResponse.json(
        { message: "All required fields must be filled" }, 
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }
    
    // Phone number validation
    const phoneRegex = /^\+\d{1,4}\d{6,}$/;
    if (!phoneRegex.test(whatsapp)) {
      return NextResponse.json(
        { message: "Please provide a valid phone number with country code" },
        { status: 400 }
      );
    }

    // Enhanced password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { 
          message: "Password must be at least 6 characters and contain:",
          requirements: [
            "At least one uppercase letter (A-Z)",
            "At least one lowercase letter (a-z)",
            "At least one number (0-9)",
            "At least one special character (@$!%*?&)"
          ]
        },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if parent already exists
    const existing = await Parent.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Parent already exists" }, 
        { status: 409 }
      );
    }

    // Hash password and create new parent
    const hashedPassword = await bcrypt.hash(password, 10);
    const newParent = new Parent({
      email,
      whatsapp,
      password: hashedPassword,
      role,
      address: {
        country,
        countryCode
      },
      paymentStatus: 'pending',
    });

    await newParent.save();

    return NextResponse.json(
      { message: "Parent registered successfully" }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  }
}