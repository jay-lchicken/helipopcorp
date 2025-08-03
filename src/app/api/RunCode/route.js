import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { source_code, language_id, stdin} = body;

  const response = await fetch("https://judge0.techtime.coffee/submissions?base64_encoded=true&wait=true", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_code: Buffer.from(source_code).toString("base64"),
      language_id: language_id || 63,
stdin: stdin ? Buffer.from(stdin).toString("base64") : "",    }),
  });
  console.log(stdin)

  const data = await response.json();

  if (data.stdout) data.stdout = Buffer.from(data.stdout, "base64").toString();
  if (data.stderr) data.stderr = Buffer.from(data.stderr, "base64").toString();
  if (data.compile_output) data.compile_output = Buffer.from(data.compile_output, "base64").toString();

  return NextResponse.json(data);
}