import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure this path matches your setup

export async function POST(req) {
  const body = await req.json();

  if (body.type === "user.created") {
    const userId = body.data.id;
    const email = body.data.email_addresses?.[0]?.email_address || "";

    const teacherDomain = "@s2024.ssts.edu.sg"; // Your teacher domain
    const role = email.endsWith(teacherDomain) ? "teacher" : "student";

    try {
      // Insert into your DB
      await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          role,
        },
      });

      console.log(`Created user: ${email} as ${role}`);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Failed to insert user into DB:", err);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Ignored non-user.created event" });
}