import { auth, clerkClient } from "@clerk/nextjs/server"; // use clerkClient
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import IDE2 from "@/app/dashboard/[assignmentId]/[submissionId]/IDE";
import crypto from "node:crypto";
export default async function Main({ params }) {
    const { userId, sessionClaims } = await auth();

const submissionId = params.submissionId;

const response = await clerkClient();
const user = await response.users.getUser(userId);
    const email = sessionClaims?.email;
    const hash = crypto.createHash('sha256').update(email+userId).digest('hex');
    console.log(hash);
    console.log(submissionId);
    if (!userId) {
        redirect("/");
    }
    try {
        const result = await pool.query(
            `SELECT 
                s.hash_userid_email,
                s.name AS user_id, 
                s.id, 
                s.date_created AS created_at, 
                s.code, 
                s.assignment_id, 
                s.language_id,
                s.id AS submission_id,
                s.score,
                s.feedback,
                a.total_score
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            WHERE s.id = $1 AND s.hash_userid_email = $2`,
            [submissionId, hash]
        );
        console.log(result);
        if (result.rowCount === 0) {
            return <div>Thanks for trying but ur access is denied</div>
        } else {
            return <IDE2 data={result.rows[0]} />;
        }

    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }
}