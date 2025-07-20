import pool from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as crypto from "node:crypto";

export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);
    const body = await req.json();
    const { id, name, level, subject } = body;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("sessionClaims:", sessionClaims);
    const role = sessionClaims?.privateMetadata?.isAdmin;

    if (!id || !name || !level || !subject) {
        return NextResponse.json({ error: 'Missing required fields: id, name, level, or subject' }, { status: 400 });
    }

    try {
        let assignment;
        if (!role) {
            const email = sessionClaims?.email;
            if (!email) {
                 return NextResponse.json({ error: 'Email address not found in session claims.' }, { status: 400 });
            }
            const hash = crypto.createHash('sha256').update(email + userId).digest('hex');
            assignment = await pool.query(
                `UPDATE assignments
                 SET name = $2, level = $3, subject = $4
                 WHERE id = $1 AND hash_userid_email = $5
                 RETURNING *`,
                [id, name, level, subject, hash]
            );
        } else {
            assignment = await pool.query(
                `UPDATE assignments
                 SET name = $2, level = $3, subject = $4
                 WHERE id = $1
                 RETURNING *`,
                [id, name, level, subject]
            );
        }

        if (assignment.rowCount === 0) {
            return NextResponse.json({ error: 'Assignment not found or unauthorized to update.' }, { status: 404 });
        }

        console.log('Updated rows:', assignment.rows);
        // It's good practice to return the updated assignment or a success message
        return NextResponse.json({ message: 'Assignment updated successfully', updatedAssignment: assignment.rows[0] });
    } catch (err) {
        console.error('DB error:', err);
        return new Response('Internal server error', { status: 500 });
    }
}