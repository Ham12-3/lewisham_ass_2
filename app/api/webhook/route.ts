import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import admin, { adminDb } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send enrollment confirmation email
async function sendEnrollmentEmail(
  enrollmentData: any,
  courseData: any,
  paymentDetails: any
) {
  const { studentEmail, studentName } = enrollmentData;

  // Format the payment amount
  const formattedAmount = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(paymentDetails.amount_total / 100);

  // Format course start date
  const startDate = courseData.startDate
    ? new Date(courseData.startDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "To be announced";

  // Create email content
  const emailSubject = `Enrollment Confirmation: ${courseData.title}`;

  const emailContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #4a5568;">Enrollment Confirmation</h1>
    </div>
    
    <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p>Dear ${studentName},</p>
      
      <p>Thank you for enrolling in <strong>${
        courseData.title
      }</strong>. Your place has been successfully reserved.</p>
      
      <h2 style="color: #4a5568; margin-top: 30px;">Course Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Course:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
            courseData.title
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Start Date:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${startDate}</td>
        </tr>
        ${
          courseData.location
            ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Location:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${courseData.location}</td>
        </tr>`
            : ""
        }
        ${
          courseData.duration
            ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Duration:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${courseData.duration}</td>
        </tr>`
            : ""
        }
      </table>
      
      <h2 style="color: #4a5568; margin-top: 30px;">Payment Receipt</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Amount Paid:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Transaction ID:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${
            paymentDetails.payment_intent
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString(
            "en-GB"
          )}</td>
        </tr>
      </table>
      
      <div style="margin-top: 30px;">
        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
        <p>We look forward to seeing you at the course!</p>
      </div>
    </div>
    
    <div style="text-align: center; font-size: 12px; color: #666; margin-top: 30px;">
      <p>This is an automated email. Please do not reply to this message.</p>
      <p>© ${new Date().getFullYear()} Lewisham Adult Learning. All rights reserved.</p>
    </div>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Lewisham Adult Learning" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: emailSubject,
      html: emailContent,
    });

    console.log(`Enrollment confirmation email sent to ${studentEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending enrollment email:", error);
    return false;
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret!);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Update course enrollment count
      if (session.metadata?.courseId) {
        // Get course data for the email
        const courseRef = adminDb
          .collection("courses")
          .doc(session.metadata.courseId);
        const courseDoc = await courseRef.get();
        const courseData = courseDoc.data();

        // Increment enrollment count
        await courseRef.update({
          enrollments: admin.firestore.FieldValue.increment(1),
        });

        // Store the enrollment record
        if (session.metadata?.studentEmail) {
          const enrollmentId = `${session.id}`;
          const enrollmentData = {
            courseId: session.metadata.courseId,
            courseName: session.metadata?.courseTitle || "Course Enrollment",
            studentEmail: session.metadata.studentEmail,
            studentName: session.metadata?.studentName || "Student",
            paymentId: session.payment_intent,
            paymentAmount: session.amount_total
              ? session.amount_total / 100
              : 0,
            enrolledAt: new Date().toISOString(),
            status: "active",
          };

          // Create enrollment record in Firestore
          await adminDb
            .collection("enrollments")
            .doc(enrollmentId)
            .set(enrollmentData);

          // Send enrollment confirmation email
          if (courseData) {
            await sendEnrollmentEmail(enrollmentData, courseData, session);
          }
        }
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error processing successful payment:", error);
      return NextResponse.json(
        { error: "Error processing payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
