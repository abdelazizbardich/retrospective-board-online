import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SITE_EMAIL } from "@/lib/config";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!subject || typeof subject !== "string" || subject.trim().length < 1) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }
  if (!message || typeof message !== "string" || message.trim().length < 1) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (name.trim().length > 200 || subject.trim().length > 500 || message.trim().length > 10000) {
    return NextResponse.json({ error: "Input exceeds maximum allowed length" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? SITE_EMAIL;

  if (!host || !user || !pass) {
    console.error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
    return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"${name.trim()}" <${from}>`,
      replyTo: email.trim(),
      to: SITE_EMAIL,
      subject: `[Contact] ${subject.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
<p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
<hr />
<p style="white-space:pre-wrap">${escapeHtml(message.trim())}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
