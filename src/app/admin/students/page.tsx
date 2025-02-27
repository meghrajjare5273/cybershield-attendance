import { prisma } from "@/lib/prisma";
import { StudentForm } from "@/components/student-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function StudentsPage() {
  const students = await prisma.student.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Students</h1>
      <StudentForm />
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {students.map((student) => (
              <li key={student.id}>
                {student.name} ({student.email}) {student.branch}{" "}
                {student.phone} {student.rollno}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
