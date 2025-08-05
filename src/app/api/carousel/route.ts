import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Carousel from "@/models/carouselModel";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import fs from "fs";

// Helper to extract public_id from Cloudinary URL
function getCloudinaryPublicId(url: string): string | null {
  const regex = /\/v\d+\/(.+)\.\w+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// GET: Return all carousel images
export async function GET() {
  try {
    await connectMongoDB();
    const images = await Carousel.find().sort({ createdAt: -1 });
    return NextResponse.json(images);
  } catch (error) {
    console.error("GET carousel error:", error);
    return NextResponse.json({ error: "Failed to fetch carousel images" }, { status: 500 });
  }
}

// POST: Upload a new carousel image
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file || !file.name) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(os.tmpdir(), file.name);
    await writeFile(tempPath, buffer);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "carousel",
    });

    fs.unlinkSync(tempPath); // Clean up temp file

    const newImage = await Carousel.create({
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("POST carousel error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

// DELETE: Delete carousel image using public_id from query
export async function DELETE(req: NextRequest) {
  const public_id = req.nextUrl.searchParams.get("id");

  if (!public_id) {
    return NextResponse.json({ error: "Missing image public_id" }, { status: 400 });
  }

  try {
    await connectMongoDB();

    await cloudinary.uploader.destroy(`carousel/${public_id}`);

    const deleted = await Carousel.findOneAndDelete({ public_id: `carousel/${public_id}` });

    if (!deleted) {
      return NextResponse.json({ error: "Image not found in DB" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("DELETE carousel error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
