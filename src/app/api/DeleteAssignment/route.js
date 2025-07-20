import pool from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as crypto from "node:crypto";

export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);
    const body = await req.json();
    const { name, level, subject } = body;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("sessionClaims:", sessionClaims);
    const role = sessionClaims?.privateMetadata?.isAdmin;

    try {
        let assignment;
        if (!role) {
            const email = sessionClaims?.email;
            const hash = crypto.createHash('sha256').update(email + userId).digest('hex');
            assignment = await pool.query(
                `DELETE FROM assignments
                WHERE name = $1 AND level = $2 AND subject = $3 AND hash_userid_email = $4
                RETURNING *`,
                [name, level, subject, hash]
            );
        } else {
            assignment = await pool.query(
                `DELETE FROM assignments
                WHERE name = $1 AND level = $2 AND subject = $3
                RETURNING *`,
                [name, level, subject]
            );
        }
        console.log('Deleted rows:', assignment.rows);
        return NextResponse.json({ message: 'Assignment deleted successfully' });
    } catch (err) {
        console.error('DB error:', err);
        return new Response('Internal server error', { status: 500 });
    }
}