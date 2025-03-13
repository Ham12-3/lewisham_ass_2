import { NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, updateDoc, getDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", // Updated to match required version
});

export async function POST(request: Request) {
  try {
    const { courseId, courseTitle, coursePrice, customerInfo } =
      await request.json();

    if (!courseId || !courseTitle || !coursePrice) {
      return NextResponse.json(
        { error: "Missing required course information" },
        { status: 400 }
      );
    }

    // Verify that the course exists and has spots available
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = courseSnap.data();
    const spotsRemaining =
      parseInt(courseData.maxStudents) - courseData.enrollments;

    if (spotsRemaining <= 0) {
      return NextResponse.json({ error: "Course is full" }, { status: 400 });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle,
              description: `Enrollment for ${courseTitle}`,
            },
            unit_amount: parseFloat(coursePrice) * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId,
        studentEmail: customerInfo.email,
        studentName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      },
      customer_email: customerInfo.email,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/enrollment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
