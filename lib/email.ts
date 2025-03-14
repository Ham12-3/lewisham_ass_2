import nodemailer from "nodemailer";
import { TransportOptions, SentMessageInfo } from "nodemailer";

// Configure email transport with better error handling
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Helps with some Gmail connection issues
  },
  debug: process.env.NODE_ENV !== "production", // Enable debug in development
} as TransportOptions);

// Email verification function
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("Email server connection verified successfully");
    return true;
  } catch (error) {
    console.error("Email server connection failed:", error);
    return false;
  }
}

// Helper function to send emails with proper error handling and logging
export async function sendEmail({
  to,
  subject,
  html,
  from = `"Lewisham Adult Learning" <${process.env.EMAIL_USER}>`,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    console.log(`Attempting to send email to ${to}`);

    // Fix: Add proper typing for the Promise.race result
    const info = (await Promise.race([
      transporter.sendMail({
        from,
        to,
        subject,
        html,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out")), 10000)
      ),
    ])) as SentMessageInfo; // Type assertion to resolve the unknown type

    console.log(`Email sent successfully to ${to}`, {
      messageId: info.messageId,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
}
