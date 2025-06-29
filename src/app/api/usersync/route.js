import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Check if user exists in DB
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // If not, create with role based on email domain
  if (!dbUser) {
    const teacherDomain = "@s2024.ssts.edu.sg";
    const role = user.emailAddresses[0].emailAddress.endsWith(teacherDomain)
      ? "teacher"
      : "student";

    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        role,
      },
    });
  }

  return new Response(JSON.stringify(dbUser), {
    headers: { "Content-Type": "application/json" },
  });
}