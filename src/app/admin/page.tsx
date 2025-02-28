import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/students"
          className="p-4 border rounded hover:bg-accent"
        >
          Manage Students
        </Link>
        <Link
          href="/admin/courses"
          className="p-4 border rounded hover:bg-accent"
        >
          Manage Courses
        </Link>
      </div>
    </div>
  );
}
