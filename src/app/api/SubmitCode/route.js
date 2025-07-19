import pool from "@/lib/db";
import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import * as crypto from "node:crypto";

export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);
    const body = await req.json();
    const { name, level, subject, code } = body;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("sessionClaims:", sessionClaims);
    const email = sessionClaims?.email_address;
    const hash = crypto.createHash('sha256').update(email+userId).digest('hex');
  try {
    const assignment = await pool.query(
      `INSERT INTO submissions (name, level, subject, hash_userid_email, code)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, level, subject, hash, code]
    );
    console.log(assignment.rows[0]);
    return NextResponse.json(assignment.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}