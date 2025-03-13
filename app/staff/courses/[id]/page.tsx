"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, UsersIcon, BookOpenIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // If you're using Sonner for toasts
import { useAuth } from "@/lib/auth-context";

type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  startDate: string;
  maxStudents: string;
  enrollments: number;
};

export default function StaffCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // Use your auth context
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication and authorization
  useEffect(() => {
    // If auth is loaded and user is not authenticated or not staff
    if (!authLoading && (!user || !user.staff)) {
      toast.error("Access denied", {
        description: "You don't have permission to access this page.",
      });
      router.push("/login"); // Redirect to login page
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseId = params.id as string;
        const courseDoc = await getDoc(doc(db, "courses", courseId));

        if (courseDoc.exists()) {
          setCourse({
            id: courseDoc.id,
            ...(courseDoc.data() as Omit<Course, "id">),
          });
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch course if user is authenticated and has staff permissions
    if (params.id && user && user.staff) {
      fetchCourse();
    }
  }, [params.id, user]);

  // Show loading state if auth is still being determined
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If not authenticated or not staff, don't render anything (will redirect)
  if (!user || !user.staff) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg h-80"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 p-8 rounded-md">
          <p className="text-red-800 text-lg">{error}</p>
          <Link href="/courses">
            <Button className="mt-4">View All Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const spotsRemaining = parseInt(course.maxStudents) - course.enrollments;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/courses"
          className="text-primary hover:underline flex items-center gap-2"
        >
          ← Back to courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

          <Badge className="mb-6">
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </Badge>

          {course.imageUrl && (
            <div className="relative h-80 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <ClockIcon className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-gray-500">Duration</span>
              <span className="font-medium">{course.duration} weeks</span>
            </div>

            <div className="flex flex-col items-center p-4 border rounded-lg">
              <CalendarIcon className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-gray-500">Start Date</span>
              <span className="font-medium">
                {new Date(course.startDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-gray-500">Category</span>
              <span className="font-medium">{course.category}</span>
            </div>

            <div className="flex flex-col items-center p-4 border rounded-lg">
              <UsersIcon className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-gray-500">Class Size</span>
              <span className="font-medium">{course.maxStudents} students</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Course Description</h2>
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              {/* Render description with proper formatting */}
              {course.description.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold mb-4">${course.price}</div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Enrollment Status</span>
                  <span className="font-medium">
                    {spotsRemaining > 0 ? "Open" : "Full"}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Spots Remaining</span>
                  <span className="font-medium">
                    {spotsRemaining}/{course.maxStudents}
                  </span>
                </div>
              </div>

              <Button className="w-full" disabled={spotsRemaining <= 0}>
                {spotsRemaining > 0 ? "Enroll Now" : "Class Full"}
              </Button>

              {spotsRemaining <= 0 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Join the waitlist to be notified when spots open up.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
