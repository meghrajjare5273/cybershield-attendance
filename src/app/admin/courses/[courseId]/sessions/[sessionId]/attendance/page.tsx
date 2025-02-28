import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveCourseAttendance } from "@/actions/attendance-actions";
import { redirect } from "next/navigation";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ courseId: string; sessionId: string }>; // Type params as a Promise
}) {
  const { courseId, sessionId } = await params; // Await params to get the object
  const session = await prisma.courseSession.findUnique({
    where: { id: sessionId }, // Use sessionId directly
    include: {
      course: { include: { enrollments: { include: { student: true } } } },
      attendances: true,
    },
  });

  if (!session) return <div>Session not found</div>;

  const students = session.course.enrollments.map((e) => e.student);
  const attendanceMap = new Map(
    session.attendances.map((a) => [a.studentId, a.present])
  );

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const result = await saveCourseAttendance(formData, sessionId); // Use sessionId variable
    if (result.success) {
      redirect(`/admin/courses/${courseId}`); // Use courseId variable
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Attendance for {session.date.toDateString()}
      </h1>
      <form action={handleSubmit}>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`attendance-${student.id}`}
                name={`attendance-${student.id}`}
                defaultChecked={attendanceMap.get(student.id) || false}
              />
              <Label htmlFor={`attendance-${student.id}`}>
                {student.name} ({student.rollno})
              </Label>
            </div>
          ))}
          <Button type="submit">Save Attendance</Button>
        </div>
      </form>
    </div>
  );
}
