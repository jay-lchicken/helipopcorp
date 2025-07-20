import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const name = url.searchParams.get("name");

    if (!name) {
      console.error("Missing query parameters:", { name });
      return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT * FROM submissions WHERE name = $1",
      [name]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error in GetSubmissions API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}