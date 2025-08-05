import { NextRequest, NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_URL = process.env.WHATSAPP_URL;

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, message } = await req.json();

    if (!phoneNumber || !message) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    const payload = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: { body: message },
    };

    const res = await fetch(`${WHATSAPP_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("WhatsApp API Error:", data);
      return NextResponse.json({ success: false, error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: "Message sent", data });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
