import { prisma } from "@/lib/prisma";
import { SessionForm } from "@/components/session-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: { sessions: true, enrollments: { include: { student: true } } },
  });

  if (!course) return <div>Course not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{course.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionForm courseId={course.id} />
          <ul className="space-y-2 mt-4">
            {course.sessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/admin/courses/${course.id}/sessions/${session.id}/attendance`}
                  className="hover:underline"
                >
                  {session.date.toDateString()}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {course.enrollments.map((enrollment) => (
              <li key={enrollment.id}>{enrollment.student.name}</li>
            ))}
          </ul>
          {/* Add enrollment form here if needed */}
        </CardContent>
      </Card>
    </div>
  );
}
