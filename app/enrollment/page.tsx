"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EnrollmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Buttons */}
      <div className="flex gap-2 mb-6">
        <Link href="/" passHref legacyBehavior>
          <Button asChild variant="outline">
            <a>Home</a>
          </Button>
        </Link>
        <Link href="/courses" passHref legacyBehavior>
          <Button asChild variant="outline">
            <a>Courses</a>
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Enrollment</h1>
      <p className="text-center text-gray-600">
        Choose a course from the Courses page to enroll.
      </p>
    </div>
  );
}