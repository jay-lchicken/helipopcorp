import pool from "@/lib/db";
import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import * as crypto from "node:crypto";

export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);
    const body = await req.json();
    const { name } = body;
    const email = sessionClaims?.email;

    if (!userId || !email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("sessionClaims:", sessionClaims);
    const hash = crypto.createHash('sha256').update(email+userId).digest('hex');
      console.log(email, userId, hash);

  try {
    const assignment = await pool.query(
      `INSERT INTO assignments (name, hash_userid_email)
       VALUES ($1, $2)
       RETURNING *`,
      [name, hash]
    );
    console.log(assignment.rows[0]);
    return Response.json(assignment.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}