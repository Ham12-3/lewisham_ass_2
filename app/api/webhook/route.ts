import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { doc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();

  // Fix the headers issue - use a different approach
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
        // Update the course enrollment count
        const courseRef = doc(db, "courses", session.metadata.courseId);
        await updateDoc(courseRef, {
          enrollments: increment(1),
        });

        // Store the enrollment record
        if (session.metadata?.studentEmail) {
          const enrollmentId = `${session.id}`;
          await setDoc(doc(db, "enrollments", enrollmentId), {
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
          });
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
