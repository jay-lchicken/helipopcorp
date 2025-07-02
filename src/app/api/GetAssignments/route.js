import pool from "@/lib/db";
import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import * as crypto from "node:crypto";
export async function GET(res) {
    const { userId, sessionClaims } = getAuth(res);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const email = sessionClaims?.email;
    const hash_userid_email = crypto.createHash("sha256").update(email + userId).digest("hex");
    try {
        const assignments = await pool.query(
            "SELECT * FROM assignments WHERE hash_userid_email = $1",
            [hash_userid_email]
        );
        return NextResponse.json(assignments.rows);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}