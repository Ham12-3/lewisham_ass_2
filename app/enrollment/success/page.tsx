"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnrollmentSuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [enrollmentDetails, setEnrollmentDetails] = useState<any>(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    async function getEnrollmentDetails() {
      if (!sessionId) return;

      try {
        const response = await fetch(
          `/api/enrollment-details?session_id=${sessionId}`
        );
        if (response.ok) {
          const data = await response.json();
          setEnrollmentDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch enrollment details:", error);
      } finally {
        setLoading(false);
      }
    }

    getEnrollmentDetails();
  }, [sessionId]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Enrollment Successful!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for enrolling in our course.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollmentDetails && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Course:</span>{" "}
                    {enrollmentDetails.courseName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Start Date:</span>{" "}
                    {new Date(enrollmentDetails.startDate).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}

            <p className="text-center text-sm text-gray-600">
              We've sent a confirmation email with all the course details and
              next steps.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/courses">Browse More Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
