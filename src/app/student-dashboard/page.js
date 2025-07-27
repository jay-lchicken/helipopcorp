import { auth, clerkClient } from "@clerk/nextjs/server";
import Assignment from "./assignment";
import { cookies } from "next/headers";
import CompletedAssignments from "./assignment";
import pool from "@/lib/db";

export default async function Main() {
  const { userId, sessionClaims } = await auth()
    const email = sessionClaims?.email;

    var user;
    var clerkUser;
    console.log("USER ID" + userId)





    try {
        const cookieStore = await cookies();

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/usersync`, {
            headers: {
                Cookie: cookieStore?.getAll?.().map(c => `${c.name}=${c.value}`).join('; ') || ''
            },
            credentials: 'include'
        });
        if (res.ok) {
             user = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }
    console.log("Email:", email);
    const userResult = await pool.query('SELECT *, a.name as assignment_name FROM submissions JOIN assignments a ON submissions.assignment_id = a.id WHERE submissions.name = $1;', [email]);
    return (
        <CompletedAssignments
            submissions={userResult.rows}
        />
    );
}
