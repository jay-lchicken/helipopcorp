import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
import * as crypto from "node:crypto";
import pool from "@/lib/db";

export async function GET(req) {
  const { userId, sessionClaims } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const email = sessionClaims?.email;

  const hash_userid_email = crypto.createHash("sha256").update(email+userId).digest("hex");
  console.log(email,userId, hash_userid_email);
  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.privateMetadata?.isAdmin;
    if (!role) {
        const assignments = await pool.query(
            "SELECT * FROM assignments WHERE hash_userid_email = $1",
            [hash_userid_email]
        );
        console.log(hash_userid_email );
        console.log(assignments.rows)
        console.log("User is not an admin")
        return NextResponse.json(assignments.rows);
    } else {
      const assignments = await pool.query("SELECT * FROM assignments");
      console.log("User is an admin")
      return NextResponse.json(assignments.rows);
    }
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
