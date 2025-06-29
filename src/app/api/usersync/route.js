import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { userId, sessionClaims } = getAuth(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("sessionClaims:", sessionClaims);
    const email = sessionClaims?.email;
    let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    const teacherDomain = "@s2024.ssts.edu.sg";
    const role = email.endsWith(teacherDomain)
      ? "teacher"
      : "student";

    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: email,
        role,
      },
    });
  }

  return new Response(JSON.stringify(dbUser), {
    headers: { "Content-Type": "application/json" },
  });
}