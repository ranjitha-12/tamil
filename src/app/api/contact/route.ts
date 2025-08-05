import { NextRequest, NextResponse } from 'next/server';
import ContactMessage from '@/models/contactMessageModel';
import { connectMongoDB } from '@/lib/mongodb';

// POST – Save a contact message
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await connectMongoDB();
    await ContactMessage.create({ name, email, message });

    return NextResponse.json({ success: true, message: 'Message saved successfully.' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET – Fetch all contact messages
export async function GET() {
  try {
    await connectMongoDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 }); // Newest first
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
