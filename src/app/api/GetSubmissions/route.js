import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "node:crypto";

export async function GET(req) {
  const { userId, sessionClaims } = getAuth(req);
  const email = sessionClaims?.email;

  if (!userId || !sessionClaims?.email) {
    return NextResponse.json({ error: 'Unauthorized: no email' }, { status: 401 });
  }
        const hash = crypto.createHash('sha256').update(email+userId).digest('hex');

  const url = new URL(req.url);
  const assignmentID = url.searchParams.get("assignmentID");

  if (!assignmentID) {
    console.error("Missing query parameters:", { assignmentID });
    return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT
    a.hash_userid_email,
    s.name AS user_id,
    s.id,
    s.date_created AS created_at,
    s.code,
    s.assignment_id,
    s.language_id,
    s.score
FROM submissions s
         JOIN assignments a ON s.assignment_id = a.id
WHERE s.assignment_id = $1 AND a.hash_userid_email = $2`,
      [assignmentID, hash]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error in GetSubmissions API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}