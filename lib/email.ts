import nodemailer from "nodemailer";
import { TransportOptions, SentMessageInfo } from "nodemailer";

// Update the email transport configuration
export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Helps with some Gmail connection issues
  },
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

// Add new function to generate enrollment confirmation emails

/**
 * Creates a beautiful enrollment confirmation email with course details and payment receipt
 */
export function createEnrollmentEmail({
  studentName,
  courseName,
  courseDate,
  courseLocation,
  courseDuration,
  paymentAmount,
  paymentId,
  enrolledAt,
}: {
  studentName: string;
  courseName: string;
  courseDate?: string;
  courseLocation?: string;
  courseDuration?: string;
  paymentAmount: string;
  paymentId: string;
  enrolledAt: string;
}): string {
  // Format date for display
  const formattedDate = courseDate || "To be announced";
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Generate a unique receipt number based on payment ID and date
  const receiptNumber = `LWS-${paymentId.substring(0, 8)}-${Date.now()
    .toString()
    .substring(8, 13)}`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Enrollment Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; background-color: #f9f9f9;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
            
            <!-- Header -->
            <tr>
              <td style="background-color: #00275b; padding: 30px 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Enrollment Confirmation</h1>
                <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Thank you for choosing Lewisham Adult Learning</p>
              </td>
            </tr>
            
            <!-- Main Content -->
            <tr>
              <td style="padding: 40px;">
                <p style="margin-top: 0; font-size: 16px; line-height: 1.5;">Dear <strong>${studentName}</strong>,</p>
                
                <p style="font-size: 16px; line-height: 1.5;">Thank you for enrolling in one of our courses. Your registration has been successfully processed, and we're excited to welcome you!</p>
                
                <!-- Confirmation Box -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #f2f8ff; border-left: 4px solid #00275b; border-radius: 4px; padding: 20px;">
                  <tr>
                    <td>
                      <p style="margin: 0; font-size: 16px;">You have successfully enrolled in:</p>
                      <h2 style="margin: 10px 0 0 0; color: #00275b; font-size: 22px;">${courseName}</h2>
                    </td>
                  </tr>
                </table>
                
                <!-- Course Details -->
                <h3 style="font-size: 18px; color: #00275b; margin: 30px 0 15px 0; border-bottom: 1px solid #e1e8ed; padding-bottom: 8px;">Course Details</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tr>
                    <td width="120" style="padding: 12px 0; vertical-align: top; color: #666666; font-weight: 500;">Course:</td>
                    <td style="padding: 12px 0; vertical-align: top;">${courseName}</td>
                  </tr>
                  <tr>
                    <td width="120" style="padding: 12px 0; vertical-align: top; color: #666666; font-weight: 500; border-top: 1px solid #f0f0f0;">Start Date:</td>
                    <td style="padding: 12px 0; vertical-align: top; border-top: 1px solid #f0f0f0;">${formattedDate}</td>
                  </tr>
                  ${
                    courseLocation
                      ? `
                  <tr>
                    <td width="120" style="padding: 12px 0; vertical-align: top; color: #666666; font-weight: 500; border-top: 1px solid #f0f0f0;">Location:</td>
                    <td style="padding: 12px 0; vertical-align: top; border-top: 1px solid #f0f0f0;">${courseLocation}</td>
                  </tr>`
                      : ""
                  }
                  ${
                    courseDuration
                      ? `
                  <tr>
                    <td width="120" style="padding: 12px 0; vertical-align: top; color: #666666; font-weight: 500; border-top: 1px solid #f0f0f0;">Duration:</td>
                    <td style="padding: 12px 0; vertical-align: top; border-top: 1px solid #f0f0f0;">${courseDuration}</td>
                  </tr>`
                      : ""
                  }
                </table>
                
                <!-- Receipt -->
                <h3 style="font-size: 18px; color: #00275b; margin: 30px 0 15px 0; border-bottom: 1px solid #e1e8ed; padding-bottom: 8px;">Payment Receipt</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #f9f9f9; border-radius: 4px; overflow: hidden; margin-bottom: 30px;">
                  <tr>
                    <td colspan="2" style="background-color: #e1e8ed; padding: 12px 20px;">
                      <p style="margin: 0; font-size: 14px;">Receipt #: ${receiptNumber}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; border-bottom: 1px solid #e1e8ed; width: 50%;">Date:</td>
                    <td style="padding: 12px 20px; border-bottom: 1px solid #e1e8ed; text-align: right; font-weight: 600;">${today}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; border-bottom: 1px solid #e1e8ed;">Course:</td>
                    <td style="padding: 12px 20px; border-bottom: 1px solid #e1e8ed; text-align: right; font-weight: 600;">${courseName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; border-bottom: 1px solid #e1e8ed;">Transaction ID:</td>
                    <td style="padding: 12px 20px; border-bottom: 1px solid #e1e8ed; text-align: right; font-size: 13px;">${paymentId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 20px; font-size: 18px;">Amount:</td>
                    <td style="padding: 15px 20px; text-align: right; font-size: 18px; font-weight: bold;">${paymentAmount}</td>
                  </tr>
                </table>
                
                <p style="font-size: 16px; line-height: 1.5;">Please keep this email as your receipt and proof of enrollment. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 0;">We look forward to seeing you at the course!</p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f2f2f2; padding: 30px 40px; text-align: center; border-top: 1px solid #e1e8ed;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">© ${new Date().getFullYear()} Lewisham Adult Learning. All rights reserved.</p>
                <p style="margin: 0; font-size: 13px; color: #999999;">This is an automated message. Please do not reply to this email.</p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
