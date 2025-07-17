import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASS,
  database: process.env.SUPABASE_DB,
  port: Number(process.env.SUPABASE_PORT),
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM branch_data');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
}
