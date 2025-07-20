import pool from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as crypto from "node:crypto";

export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);
    const body = await req.json();
    const { name } = body;
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
                WHERE name = $1 AND hash_userid_email = $2
                RETURNING *`,
                [name, hash]
            );
        } else {
            assignment = await pool.query(
                `DELETE FROM assignments
                WHERE name = $1
                RETURNING *`,
                [name]
            );
        }
        console.log('Deleted rows:', assignment.rows);
        return NextResponse.json({ message: 'Assignment deleted successfully' });
    } catch (err) {
        console.error('DB error:', err);
        return new Response('Internal server error', { status: 500 });
    }
}