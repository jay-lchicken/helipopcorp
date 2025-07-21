import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId || !sessionClaims?.email) {
    return NextResponse.json({ error: 'Unauthorized: no email' }, { status: 401 });
  }

  const url = new URL(req.url);
  const assignmentID = url.searchParams.get("assignmentID");

  if (!assignmentID) {
    console.error("Missing query parameters:", { assignmentID });
    return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT 
         hash_userid_email,
         name AS user_id, 
         id, 
         date_created AS created_at, 
         code, 
         assignment_id, 
         language_id
       FROM submissions 
       WHERE assignment_id = $1`,
      [assignmentID]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error in GetSubmissions API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}