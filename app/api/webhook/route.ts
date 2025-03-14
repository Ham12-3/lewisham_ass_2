import { NextResponse } from "next/server";
import Stripe from "stripe";
import admin, { adminDb } from "@/lib/firebase-admin";
import { sendEmail, transporter, createEnrollmentEmail } from "@/lib/email";

// Define interfaces for our data structures
interface EnrollmentData {
  courseId: string;
  courseName: string;
  studentEmail: string;
  studentName: string;
  paymentId: string | null; // Now accepts null
  paymentAmount: number;
  enrolledAt: string;
  status: string;
}

interface CourseData {
  id: string;
  title: string;
  startDate?: string;
  location?: string;
  duration?: string;
  [key: string]: any; // Allow for additional properties
}

// Simple logging utility with timestamps
const logger = {
  info: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  },
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`);
    if (error) {
      if (error instanceof Error) {
        console.error(`Name: ${error.name}`);
        console.error(`Message: ${error.message}`);
        console.error(`Stack: ${error.stack}`);
      } else {
        console.error(error);
      }
    }
  },
  warning: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARNING] [${timestamp}] ${message}`);
    if (data) console.warn(JSON.stringify(data, null, 2));
  },
};

logger.info("Initializing webhook handler");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Types for the log data
type LogType = "webhook" | "email" | "enrollment";

interface LogData {
  status: string;
  timestamp?: string;
  [key: string]: any; // Allow additional properties
}

// Store logs in Firestore for easier debugging and monitoring
async function storeLog(type: LogType, data: LogData): Promise<void> {
  try {
    await adminDb.collection("logs").add({
      type,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
  } catch (error) {
    logger.error("Failed to store logs in Firestore", error);
  }
}

// Verify the connection configuration during startup
(async function verifyTransporter() {
  try {
    logger.info("Verifying email transport connection");
    await transporter.verify();
    logger.info("Email server connection verified successfully");
  } catch (error) {
    logger.error("Email server connection failed", error);

    // Store connection error in logs collection
    await storeLog("email", {
      status: "error",
      action: "connection_verification",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
})();

// Define a simple interface for the expected nodemailer response
interface EmailSendResult {
  messageId: string;
  response: string;
  // Add other properties you might need
}

// Function to send enrollment confirmation email with better error handling
async function sendEnrollmentEmail(
  enrollmentData: EnrollmentData,
  courseData: CourseData,
  paymentDetails: Stripe.Checkout.Session
): Promise<boolean> {
  const { studentEmail, studentName, courseId } = enrollmentData;
  logger.info(
    `Preparing enrollment email for ${studentEmail} for course ${courseId}`
  );

  // Format the payment amount
  const formattedAmount = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format((paymentDetails.amount_total || 0) / 100);

  // Use payment_intent as string or fallback to a generated ID
  const paymentId =
    typeof paymentDetails.payment_intent === "string"
      ? paymentDetails.payment_intent
      : `manual-${Date.now()}`;

  try {
    logger.info(`Sending enrollment email to ${studentEmail}`);

    // Use the new template function
    const htmlContent = createEnrollmentEmail({
      studentName: studentName,
      courseName: courseData.title,
      courseDate: courseData.startDate,
      courseLocation: courseData.location,
      courseDuration: courseData.duration,
      paymentAmount: formattedAmount,
      paymentId: paymentId,
      enrolledAt: enrollmentData.enrolledAt,
    });

    // Send the email
    const result = await sendEmail({
      to: studentEmail,
      subject: `Enrollment Confirmation: ${courseData.title}`,
      html: htmlContent,
    });

    logger.info(`Email sent successfully to ${studentEmail}`, {
      messageId: result.messageId,
    });

    return true;
  } catch (error) {
    logger.error(`Failed to send enrollment email to ${studentEmail}`, error);
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  logger.info("Webhook request received");

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    logger.error("Missing Stripe signature");
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    logger.info("Verifying Stripe webhook signature");
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret!);
    logger.info(`Webhook event verified: ${event.type}`, {
      id: event.id,
      type: event.type,
      created: new Date(event.created * 1000).toISOString(),
    });

    // Store webhook event log
    await storeLog("webhook", {
      eventId: event.id,
      eventType: event.type,
      created: new Date(event.created * 1000).toISOString(),
      status: "received",
    });
  } catch (err: any) {
    logger.error("Webhook signature verification failed", err);

    // Store failed webhook verification log
    await storeLog("webhook", {
      status: "signature_failed",
      error: err instanceof Error ? err.message : "Unknown error",
    });

    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    logger.info("Processing completed checkout session", {
      sessionId: session.id,
      customer: session.customer,
      amount: session.amount_total,
    });

    try {
      // Update course enrollment count
      if (session.metadata?.courseId) {
        const courseId = session.metadata.courseId;
        logger.info(`Fetching course data for ID: ${courseId}`);

        // Get course data for the email
        const courseRef = adminDb.collection("courses").doc(courseId);
        const courseDoc = await courseRef.get();

        if (!courseDoc.exists) {
          logger.error(`Course with ID ${courseId} not found`);
          throw new Error(`Course with ID ${courseId} not found`);
        }

        // Safely cast Firestore data to CourseData type with the required 'id' and 'title' fields
        const courseDocData = courseDoc.data() || {};
        const courseData: CourseData = {
          id: courseId,
          title: courseDocData.title || "Course", // Provide default value if missing
          ...courseDocData,
        };

        logger.info(`Found course: ${courseData.title}`);

        // Increment enrollment count
        logger.info(`Incrementing enrollment count for course ${courseId}`);
        await courseRef.update({
          enrollments: admin.firestore.FieldValue.increment(1),
        });
        logger.info(
          `Successfully updated enrollment count for course ${courseId}`
        );

        // Store the enrollment record
        if (session.metadata?.studentEmail) {
          const studentEmail = session.metadata.studentEmail;
          const enrollmentId = `${session.id}`;

          logger.info(
            `Creating enrollment record for student ${studentEmail}`,
            {
              enrollmentId,
              courseId,
            }
          );

          // Quick fixes for TypeScript errors

          // Fix 1: Payment Intent error - use type assertion
          const enrollmentData: EnrollmentData = {
            courseId: courseId,
            courseName: session.metadata?.courseTitle || "Course Enrollment",
            studentEmail: studentEmail,
            studentName: session.metadata?.studentName || "Student",
            paymentId:
              (session.payment_intent as string) || `manual_${Date.now()}`,
            paymentAmount: session.amount_total
              ? session.amount_total / 100
              : 0,
            enrolledAt: new Date().toISOString(),
            status: "active",
          };

          // Store enrollment log
          await storeLog("enrollment", {
            enrollmentId,
            courseId,
            studentEmail,
            paymentId: session.payment_intent,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            status: "created",
          });

          // Create enrollment record in Firestore
          await adminDb
            .collection("enrollments")
            .doc(enrollmentId)
            .set(enrollmentData);

          logger.info(`Successfully created enrollment record ${enrollmentId}`);

          // Send enrollment confirmation email
          if (courseData) {
            logger.info(
              `Sending enrollment confirmation email to ${studentEmail}`
            );

            // Fix 2 & 3: Duplicate properties in courseDataForEmail
            const courseDataForEmail: CourseData = {
              ...courseData, // Spread courseData first
              // No need to redefine properties here, they'll be included from courseData
            };

            const emailSent = await sendEnrollmentEmail(
              enrollmentData,
              courseDataForEmail,
              session
            );

            if (emailSent) {
              logger.info(`Email sent successfully to ${studentEmail}`);
            } else {
              logger.warning(
                `Failed to send email to ${studentEmail}, but enrollment was created`
              );
            }
          } else {
            logger.error(
              `Cannot send email - course data missing for ${courseId}`
            );
          }
        } else {
          logger.warning(
            `No student email found in session metadata, skipping enrollment record`
          );
        }
      } else {
        logger.warning(
          `No course ID found in session metadata, skipping course update`
        );
      }

      logger.info("Webhook processing completed successfully");
      return NextResponse.json({ received: true });
    } catch (error) {
      logger.error("Error processing successful payment", error);

      // Store error log
      await storeLog("webhook", {
        eventId: event.id,
        eventType: event.type,
        status: "processing_failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json(
        { error: "Error processing payment" },
        { status: 500 }
      );
    }
  } else {
    logger.info(`Ignoring non-checkout event: ${event.type}`);
  }

  logger.info("Webhook handled successfully");
  return NextResponse.json({ received: true });
}
