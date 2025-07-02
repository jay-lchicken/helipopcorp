import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import pool from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request) {
  const { userId, sessionClaims } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log("sessionClaims:", sessionClaims);

  let email = sessionClaims?.email;

  // Fallback: fetch email from Clerk API if not in sessionClaims
  if (!email) {
    const clerkUser = await clerkClient.users.getUser(userId);
    email = clerkUser?.emailAddresses?.[0]?.emailAddress;
  }

  const result = await pool.query(
    `SELECT * FROM users WHERE clerkId = $1`,
    [userId]
  );

  let dbUser = result.rows[0];

  console.log("dbUser:", dbUser);

  if (!dbUser) {
    const teacherDomain = "@s2024.ssts.edu.sg";
    const role = email?.endsWith(teacherDomain) ? "teacher" : "student";

    const insertResult = await pool.query(
      `INSERT INTO users (clerkId, email, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, email, role]
    );

    dbUser = insertResult.rows[0];
  }

  return new Response(JSON.stringify(dbUser), {
    headers: { "Content-Type": "application/json" },
  });
}