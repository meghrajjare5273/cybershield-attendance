"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { addCourse } from "@/actions/course-actions";
import { useRouter } from "next/navigation";

export function CourseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    const result = await addCourse(formData);
    setIsSubmitting(false);
    setMessage(result.message);
    if (result.success) {
      router.refresh(); // Refresh the page to show the new course
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" required />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Course"}
            </Button>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}