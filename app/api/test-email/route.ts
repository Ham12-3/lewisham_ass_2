import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const result = await sendEmail({
      to: process.env.EMAIL_USER!, // Send to yourself for testing
      subject: "Test Email from Lewisham Learning",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
          <h1 style="color: #4a5568;">Test Email</h1>
          <p>This is a test email from your Lewisham Learning platform.</p>
          <p>If you're receiving this, your email configuration is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
