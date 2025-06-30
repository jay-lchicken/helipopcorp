import pool from '@/lib/prisma.js';
import {getAuth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import * as crypto from "node:crypto";
import prisma from "@/lib/prisma.js";
export async function POST(req) {
    const { userId, sessionClaims } = getAuth(req);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("sessionClaims:", sessionClaims);
    const email = sessionClaims?.email;
    const hash = crypto.createHash('sha256').update(email+userId).digest('hex');
  try {
    const assignment = await prisma.assignment.add
    return Response.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}