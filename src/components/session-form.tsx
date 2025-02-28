"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export async function addCourseSession(formData: FormData, courseId: string) {
  "use server";
  const { prisma } = await import("@/lib/prisma");
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const date = new Date(formData.get("date") as string);

  await prisma.courseSession.create({ data: { courseId, date } });
}

export function SessionForm({ courseId }: { courseId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={(formData) => addCourseSession(formData, courseId)}
      onSubmit={() => setIsSubmitting(true)}
    >
      <div className="flex space-x-4">
        <div>
          <Label htmlFor="date">Session Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <Button type="submit" disabled={isSubmitting} className="self-end">
          {isSubmitting ? "Adding..." : "Add Session"}
        </Button>
      </div>
    </form>
  );
}