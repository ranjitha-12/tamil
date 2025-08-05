import { connectMongoDB } from "@/lib/mongodb";
import Admin from "@/models/adminModel";
import { NextResponse } from "next/server";

interface AdminExistsRequestBody {
  email: string;
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { email }: AdminExistsRequestBody = await req.json();
    const admin = await Admin.findOne({ email }).select("_id");

    return NextResponse.json({ admin: admin || null }, { status: 200 });
  } catch (error) {
    console.error("Admin exists check error:", error);
    return NextResponse.json({ admin: null, error: "Failed to check admin" }, { status: 500 });
  }
}

