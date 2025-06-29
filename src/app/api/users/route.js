import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM users');
    return Response.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}