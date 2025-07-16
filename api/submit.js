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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const {
    branch_name,
    kyc_updation,
    deduplication,
    edd,
    ria,
    deaf_accounts,
    ccsc_updation,
    zta_bgl_attended,
    current_dqi,
    legacy_dqi,
    notes
  } = req.body;

  if (!branch_name) {
    return res.status(400).json({ error: 'Branch name is required' });
  }

  const query = `
    INSERT INTO branch_data (
      branch_name, kyc_updation, deduplication, edd, ria,
      deaf_accounts, ccsc_updation, zta_bgl_attended,
      current_dqi, legacy_dqi
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  `;

  const values = [
    branch_name,
    Number(kyc_updation || 0),
    Number(deduplication || 0),
    Number(edd || 0),
    Number(ria || 0),
    Number(deaf_accounts || 0),
    Number(ccsc_updation || 0),
    Number(zta_bgl_attended || 0),
    Number(current_dqi || 0),
    Number(legacy_dqi || 0),
  ];

  try {
    const client = await pool.connect();
    await client.query(query, values);
    client.release();
    res.status(200).json({ message: 'Data submitted successfully' });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Failed to submit data' });
  }
}
