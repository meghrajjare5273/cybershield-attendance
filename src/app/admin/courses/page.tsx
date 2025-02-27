import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/course-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Courses</h1>
      <CourseForm />
      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.id}>
                <Link href={`/admin/courses/${course.id}`} className="hover:underline">
                  {course.name}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}