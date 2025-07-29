import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import StudentDashboardPage from "./assignment";

export default async function Main() {
    const { userId, sessionClaims } = await auth();
    var user;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("sessionClaims:", sessionClaims);
    const email = sessionClaims?.email;

    try {
        const cookieStore = await cookies();
        const cookieHeader = {
            headers: {
                Cookie: cookieStore?.getAll?.().map(c => `${c.name}=${c.value}`).join('; ') || ''
            },
            credentials: 'include'
        };

        const userRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/usersync`, cookieHeader);
        if (userRes.ok) {
            user = await userRes.json();
        }
    } catch (err) {
        console.error("Failed to fetch data from DB", err);
    }

    const userResult = await pool.query(
        `SELECT *, 
               a.name as assignment_name,
               submissions.date_created as submission_date_created,
               submissions.id as submission_id
        FROM submissions
        JOIN assignments a ON submissions.assignment_id = a.id
        WHERE submissions.name = $1`, [email]);
    console.log("userResult:", userResult);
    return (
        <StudentDashboardPage
            serverSubmissions={userResult.rows}
        />
    );
}