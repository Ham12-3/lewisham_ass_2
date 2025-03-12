"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";

type CourseStats = {
  totalCourses: number;
  totalEnrollments: number;
  activeCourses: number;
};

export default function StaffDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    totalEnrollments: 0,
    activeCourses: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchDashboardData();
      } else {
        router.push("/staff/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch courses
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const totalCourses = coursesSnapshot.docs.length;

      // Fetch active courses
      const activeCoursesQuery = query(
        collection(db, "courses"),
        where("status", "==", "active")
      );
      const activeCoursesSnapshot = await getDocs(activeCoursesQuery);
      const activeCourses = activeCoursesSnapshot.docs.length;

      // Fetch enrollments
      const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
      const totalEnrollments = enrollmentsSnapshot.docs.length;

      setStats({
        totalCourses,
        activeCourses,
        totalEnrollments,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <Button onClick={() => auth.signOut()}>Sign Out</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalCourses}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.activeCourses}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalEnrollments}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Course Management</CardTitle>
              <Link href="/staff/courses/add">
                <Button>Add New Course</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Course list component will go here */}
            <p className="text-gray-500">
              No courses to display yet. Add your first course to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
