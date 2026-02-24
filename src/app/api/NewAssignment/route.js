import pool from "@/lib/db";
import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import * as crypto from "node:crypto";

export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);
    const body = await req.json();
    const { name, totalScore } = body;
    const email = sessionClaims?.email;

    if (!userId || !email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scoreNum = Number(totalScore);
    if (!totalScore || isNaN(scoreNum) || scoreNum <= 0) {
        return NextResponse.json({ error: 'Score must be greater than 0' }, { status: 400 });
    }
    console.log("sessionClaims:", sessionClaims);
    const hash = crypto.createHash('sha256').update(email+userId).digest('hex');
      console.log(email, userId, hash);

  try {
    const assignment = await pool.query(
      `INSERT INTO assignments (name, hash_userid_email, total_score)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, hash, totalScore]
    );
    console.log(assignment.rows[0]);
    return Response.json(assignment.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}