import { NextResponse } from "next/server";
import { createEnrollmentEmail } from "@/lib/email";

export async function GET(req: Request) {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  // Generate a sample email with dummy data
  const htmlContent = createEnrollmentEmail({
    studentName: "John Doe",
    courseName: "Introduction to Digital Skills",
    courseDate: "Monday, 15 April 2025",
    courseLocation: "Lewisham Learning Centre, Room 204",
    courseDuration: "8 weeks (2 hours per week)",
    paymentAmount: "£99.00",
    paymentId: "pi_3OadFdEiPTdx9z1P0xhvCnmE",
    enrolledAt: new Date().toISOString(),
  });

  // Return the HTML content directly to preview in browser
  return new Response(htmlContent, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
