import pool from "@/lib/db";
import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import * as crypto from "node:crypto";
import {clerkClient} from "@clerk/clerk-sdk-node";
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0
export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);
    const body = await req.json();
    const { score, feedback, submission_id, student_email, assignment_id, total_score } = body;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!userId || !sessionClaims?.email) {
      return NextResponse.json({ error: 'Unauthorized: no email' }, { status: 401 });
    }
    if (!score || !feedback || !submission_id || !student_email || !assignment_id || !total_score) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    console.log("sessionClaims:", sessionClaims);
    const email = sessionClaims?.email;
    const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.API_KEY || "API_KEY",
  });
  try {
    const data = await mg.messages.create("mail.kidslearncode.org", {
      from: "KLC IDE <grade@mail.kidslearncode.org>",
      to: [`Student <${student_email}>`],
      subject: `Your assignment ${assignment_id} has been graded`,
      text: "Hello,\n\nYour submission has been graded.\n\nScore: " + score + "/" + total_score +"\nFeedback: " + feedback + "\n\nThank you!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const role = user.privateMetadata?.isAdmin;
    if (role) {
        const assignments = await pool.query(
            `UPDATE submissions
SET score = $1,
feedback = $2
WHERE id = $1;`,
            [parseInt(score, 0), feedback, submission_id]
        );
        return NextResponse.json(assignments.rows);
    } else {
            const hash = crypto.createHash('sha256').update(email + userId).digest('hex');
const assignments = await pool.query(
  `UPDATE submissions
SET score = $1,
feedback = $2
WHERE id = $3 AND hash_userid_email = $4;`,
  [parseInt(score, 0), feedback, submission_id, hash]
);
    console.log(score, submission_id, hash)



      return NextResponse.json(assignments.rows);
    }


  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}