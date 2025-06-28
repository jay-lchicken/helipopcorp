import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST(req) {
  const body = await req.json();

  if (body.type === "user.created") {
    const userId = body.data.id;
    const email = body.data.email_addresses?.[0]?.email_address || "";

    const teacherDomain = "@s2024.ssts.edu.sg"; // change to your teacher domain
    const role = email.endsWith(teacherDomain) ? "teacher" : "student";

    try {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: { role },
      });

      console.log(`Assigned role "${role}" to ${email}`);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Failed to set user metadata:", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Ignored non-user.created event" });
}
