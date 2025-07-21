import { auth, clerkClient } from "@clerk/nextjs/server"; // use clerkClient
import { cookies } from "next/headers";
import TeacherDashboardPage from "@/app/dashboard/Dashboard";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import IDE2 from "@/app/dashboard/[assignmentId]/[submissionId]/IDE";
import crypto from "node:crypto";
export default async function Main({params}) {
    const { userId } = await auth();

    const assignmentId = params.assignmentId;
const submissionId = params.submissionId;

const response = await clerkClient();
const user = await response.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    const hash = crypto.createHash('sha256').update(email+userId).digest('hex');
    console.log(hash);
    console.log(assignmentId);
    console.log(submissionId);
    if (!userId) {
        redirect("/");
    }
    try {


        const result = await pool.query(
      `SELECT 
         hash_userid_email,
         name AS user_id, 
         id, 
         date_created AS created_at, 
         code, 
         assignment_id, 
         language_id
       FROM submissions 
       WHERE assignment_id = $1 AND id = $2 AND hash_userid_email = $3`,
      [assignmentId, submissionId, hash]
    );
        console.log(result);
         if (result.rowCount === 0) {
          return <div>Haha. Thanks for trying but ur access is denied</div>
        } else {
                            return <IDE2 data={result.rows[0]} />;

        }

    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }


}