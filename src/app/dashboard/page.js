import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import TeacherDashboardPage from "@/app/dashboard/Dashboard";
import { redirect } from "next/navigation";
import pool from "@/lib/db";

export default async function Main() {
    const { userId } = await auth();
    let assignments = [];

    if (!userId) {
        redirect("/");
    }

    try {
        const cookieStore = await cookies();

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/GetAssignments`, {
            headers: {
                Cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ') || ''
            },
            credentials: 'include'
        });

        if (res.ok) {
            assignments = await res.json();
        } else {
            console.error("API call failed:", res.status);
        }
    } catch (err) {
        console.error("Failed to fetch assignments", err);
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE clerkid = $1', [userId]);

        if (userResult.rowCount === 0) {
            // Optionally handle unknown user
        } else {
            const user = userResult.rows[0];
            console.log(`User is a ${user.role}`);

            if (user.role === 'teacher') {
                return <TeacherDashboardPage serverAssignments={assignments} />;
            } else {

            }
        }

    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }
}