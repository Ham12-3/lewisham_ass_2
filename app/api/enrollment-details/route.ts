import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    // Get enrollment details from Firestore using admin SDK
    const enrollmentDoc = await adminDb
      .collection("enrollments")
      .doc(sessionId)
      .get();

    if (!enrollmentDoc.exists) {
      // If not found in Firebase yet, try to get from Stripe directly
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session?.metadata?.courseId) {
        return NextResponse.json(
          { error: "Enrollment not found" },
          { status: 404 }
        );
      }

      // Get course details
      const courseDoc = await adminDb
        .collection("courses")
        .doc(session.metadata.courseId)
        .get();

      if (!courseDoc.exists) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const courseData = courseDoc.data();

      return NextResponse.json({
        courseName: courseData?.title,
        startDate: courseData?.startDate,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        status: "processing",
      });
    }

    // If found in Firebase, return enrollment data
    const enrollmentData = enrollmentDoc.data();

    // Get course details
    const courseDoc = await adminDb
      .collection("courses")
      .doc(enrollmentData?.courseId)
      .get();

    if (!courseDoc.exists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = courseDoc.data();

    return NextResponse.json({
      courseName: enrollmentData?.courseName,
      startDate: courseData?.startDate,
      amount: enrollmentData?.paymentAmount,
      status: enrollmentData?.status,
    });
  } catch (error) {
    console.error("Error retrieving enrollment details:", error);
    return NextResponse.json(
      { error: "Error retrieving enrollment details" },
      { status: 500 }
    );
  }
}
