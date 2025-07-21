import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import TeacherDashboardPage from "@/app/dashboard/Dashboard";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import IDE from "@/app/ide/[assignmentId]/IDE";
export default async function Main({params}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    try {
        const userResult = await pool.query('SELECT * FROM assignments where id = $1', [params.assignmentId]);

        if (userResult.rowCount === 0) {
          return <div>Haha. Thanks for trying but UR ACCESS CODE IS NOT CORRECT! MONKET IDIOT FU**</div>
        } else {
                            return <IDE />;

        }

    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }
}