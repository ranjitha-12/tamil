import { connectMongoDB } from "@/lib/mongodb";
import Admin from "@/models/adminModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectMongoDB();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ message: "Admin registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
