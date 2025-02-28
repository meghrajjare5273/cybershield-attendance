import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export async function saveCourseAttendance(formData: FormData, sessionId: string) {
  "use server";
  const { prisma } = await import("@/lib/prisma");
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const attendances = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("attendance-")) {
      const studentId = key.replace("attendance-", "");
      const present = value === "on";
      attendances.push({ studentId, present });
    }
  }

  for (const att of attendances) {
    await prisma.courseAttendance.upsert({
      where: {
        studentId_courseSessionId: {
          studentId: att.studentId,
          courseSessionId: sessionId,
        },
      },
      update: { present: att.present },
      create: {
        studentId: att.studentId,
        courseSessionId: sessionId,
        present: att.present,
      },
    });
  }
}

export default async function AttendancePage({
  params,
}: {
  params: { courseId: string; sessionId: string };
}) {
  const session = await prisma.courseSession.findUnique({
    where: { id: params.sessionId },
    include: { course: { include: { enrollments: { include: { student: true } } } } },
  });

  if (!session) return <div>Session not found</div>;

  const students = session.course.enrollments.map((e) => e.student);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Attendance for {session.date.toDateString()}
      </h1>
      <form action={(formData) => saveCourseAttendance(formData, params.sessionId)}>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`attendance-${student.id}`}
                name={`attendance-${student.id}`}
              />
              <Label htmlFor={`attendance-${student.id}`}>{student.name}</Label>
            </div>
          ))}
          <Button type="submit">Save Attendance</Button>
        </div>
      </form>
    </div>
  );
}