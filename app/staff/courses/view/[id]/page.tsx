"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  EditIcon,
  ArrowLeftIcon,
} from "lucide-react";

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
  status: string;
  createdAt: { toDate: () => Date };
  createdBy: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  enrolledAt: { toDate: () => Date };
};

export default function StaffCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/staff/login");
      } else {
        fetchCourseData();
      }
    });

    return () => unsubscribe();
  }, [params.id, router]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseId = params.id as string;
      const courseDoc = await getDoc(doc(db, "courses", courseId));

      if (courseDoc.exists()) {
        setCourse({
          id: courseDoc.id,
          ...(courseDoc.data() as Omit<Course, "id">),
        });

        // Fetch enrolled students
        const enrollmentsQuery = query(
          collection(db, "enrollments"),
          where("courseId", "==", courseId)
        );
        const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
        const studentsData: Student[] = [];

        enrollmentsSnapshot.forEach((doc) => {
          studentsData.push({
            id: doc.id,
            ...(doc.data() as Omit<Student, "id">),
          });
        });

        setStudents(studentsData);
      } else {
        setError("Course not found");
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-100 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
            <div>
              <div className="h-64 bg-gray-100 rounded mb-4"></div>
              <div className="h-40 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-8 rounded-md text-center">
          <p className="text-red-800 text-lg mb-4">{error}</p>
          <Button onClick={fetchCourseData}>Try Again</Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(course.startDate).toLocaleDateString();
  const spotsRemaining = parseInt(course.maxStudents) - course.enrollments;
  const enrollmentPercentage =
    (course.enrollments / parseInt(course.maxStudents)) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/staff/courses">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <Badge variant={course.status === "active" ? "default" : "secondary"}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </Badge>
        </div>

        <Button asChild>
          <Link href={`/staff/courses/edit/${course.id}`}>
            <EditIcon className="h-4 w-4 mr-2" /> Edit Course
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="students">
                Students ({students.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-8 pt-6">
              {course.imageUrl && (
                <div className="relative h-80 w-full rounded-lg overflow-hidden">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <ClockIcon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-gray-500">Duration</span>
                  <span className="font-medium">{course.duration} weeks</span>
                </div>

                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-gray-500">Start Date</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>

                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <UsersIcon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm text-gray-500">Max Students</span>
                  <span className="font-medium">{course.maxStudents}</span>
                </div>

                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="font-bold text-xl text-primary mb-2">
                    £{course.price}
                  </span>
                  <span className="text-sm text-gray-500">Price</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <div className="prose prose-sm sm:prose-base max-w-none">
                  {course.description.split("\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students" className="pt-6">
              {students.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Student
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Enrollment Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              {student.enrolledAt.toDate().toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-gray-500">No students enrolled yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {course.enrollments} / {course.maxStudents} spots filled
                    </span>
                    <span className="text-sm font-medium">
                      {enrollmentPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${enrollmentPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="border rounded-lg p-4">
                    <p className="text-2xl font-bold">{course.enrollments}</p>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-2xl font-bold">{spotsRemaining}</p>
                    <p className="text-sm text-gray-500">Spots Left</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{course.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Level:</span>
                  <span className="font-medium">
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">
                    {course.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
