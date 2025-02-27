// src/actions/student-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addStudent(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const branch = formData.get("branch") as string;
  const phone = formData.get("phone") as string;
  const rollno = formData.get("rollno") as string;

  await prisma.student.create({
    data: { name, email, branch, phone, rollno },
  });
}