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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET method allowed' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM branch_data');
    client.release();

    const grouped = {};

    // Group data by branch_name
    result.rows.forEach(row => {
      const branch = row.branch_name;
      if (!grouped[branch]) {
        grouped[branch] = {
          branch_name: branch,
          count: 0,
          kyc_updation: 0,
          deduplication: 0,
          edd: 0,
          ria: 0,
          deaf_accounts: 0,
          ccsc_updation: 0,
          zta_bgl_attended: 0,
          current_dqi: 0,
          legacy_dqi: 0,
        };
      }

      // Accumulate
      grouped[branch].count++;
      Object.keys(grouped[branch]).forEach(key => {
        if (key !== 'branch_name' && key !== 'count') {
          grouped[branch][key] += Number(row[key] || 0);
        }
      });
    });

    // Calculate % values (you can base this on target thresholds if needed)
    const data = Object.values(grouped).map(branch => {
      const divisor = branch.count || 1;
      Object.keys(branch).forEach(key => {
        if (key !== 'branch_name' && key !== 'count') {
          branch[key] = Math.round(branch[key] / divisor); // average
        }
      });
      delete branch.count;
      return branch;
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Dashboard data fetch failed' });
  }
}
