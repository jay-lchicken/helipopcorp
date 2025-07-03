import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.privateMetadata?.isAdmin;
    if (!role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const assignments = await pool.query("SELECT * FROM assignments");
    return NextResponse.json(assignments.rows);
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}