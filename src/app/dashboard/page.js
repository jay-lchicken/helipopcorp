import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import DashboardPage from "@/app/dashboard/Dashboard";
import pool from "@/lib/db";
import TeacherDashboardPage from "@/app/dashboard/Dashboard";
import StudentDashboardPage from "@/app/dashboard/StudentDashboard";
import Home from "@/app/Home";
import { redirect } from "next/navigation";

export default async function Main() {
    const { userId } = await auth();
    let assignments = [];


    redirect("/");
    try {
        const cookieStore = cookies();

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

        } else{
            if (userResult.rows[0].role == 'teacher') {
                console.log("User is a teacher, rendering TeacherDashboardPage");

return (
                                            <TeacherDashboardPage serverAssignments={assignments} />



    );
        }else{
                console.log("User is a student, rendering StudentDashboardPage");
                            return (
                                            <StudentDashboardPage serverAssignments={assignments} />



    );

        }
        }
        console.log("User DB result:", userResult.rows);
    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }


}