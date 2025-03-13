import { NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", // Updated to match required version
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    // Get enrollment details from Firestore
    const enrollmentRef = doc(db, "enrollments", sessionId);
    const enrollmentDoc = await getDoc(enrollmentRef);

    if (!enrollmentDoc.exists()) {
      // If not found in Firebase yet, try to get from Stripe directly
      // (might happen if webhook hasn't processed yet)
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session?.metadata?.courseId) {
        return NextResponse.json(
          { error: "Enrollment not found" },
          { status: 404 }
        );
      }

      // Get course details
      const courseRef = doc(db, "courses", session.metadata.courseId);
      const courseDoc = await getDoc(courseRef);

      if (!courseDoc.exists()) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const courseData = courseDoc.data();

      return NextResponse.json({
        courseName: courseData.title,
        startDate: courseData.startDate,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        status: "processing",
      });
    }

    // If found in Firebase, return enrollment data
    const enrollmentData = enrollmentDoc.data();

    // Get course details
    const courseRef = doc(db, "courses", enrollmentData.courseId);
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = courseDoc.data();

    return NextResponse.json({
      courseName: enrollmentData.courseName,
      startDate: courseData.startDate,
      amount: enrollmentData.paymentAmount,
      status: enrollmentData.status,
    });
  } catch (error) {
    console.error("Error retrieving enrollment details:", error);
    return NextResponse.json(
      { error: "Error retrieving enrollment details" },
      { status: 500 }
    );
  }
}
