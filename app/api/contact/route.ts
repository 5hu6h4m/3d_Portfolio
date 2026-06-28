import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // Graceful fallback for local development if mail credentials aren't defined
    if (!emailUser || !emailPass) {
      console.warn("EMAIL_USER or EMAIL_PASS not set in environment. Simulating successful message dispatch.");
      return NextResponse.json({ success: true, simulated: true });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,
      to: 'roshanb.buss@gmail.com',
      subject: `Ninja File Transmission: ${subject || 'Inquiry'} from ${name}`,
      html: `
        <div style="font-family: monospace; background: #0A0A0F; color: #F1F5F9; padding: 30px; border-left: 5px solid #DC2626;">
          <h2 style="color: #DC2626; margin-bottom: 20px;">NEW TRANSMISSION — KAKURE GIJUTSU NO SATO</h2>
          <hr style="border: 1px solid #DC2626; opacity: 0.25; margin-bottom: 20px;">
          <p style="font-size: 14px;"><strong>SENDER SHINOBI:</strong> ${name}</p>
          <p style="font-size: 14px;"><strong>EMAIL CHANNEL:</strong> ${email}</p>
          <p style="font-size: 14px;"><strong>SUBJECT ARC:</strong> ${subject || 'General Inquiry'}</p>
          <hr style="border: 1px solid #DC2626; opacity: 0.15; margin-bottom: 20px; margin-top: 20px;">
          <p style="font-size: 14px; font-weight: bold; color: #DC2626;">MESSAGE DETAILS:</p>
          <p style="font-size: 13px; color: #94A3B8; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Mail dispatch exception:", error);
    return NextResponse.json({ error: 'Uplink transaction failed to resolve' }, { status: 500 });
  }
}
