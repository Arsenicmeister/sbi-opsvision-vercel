const express = require('express');
const { Pool } = require('pg');
const app = express();

// Enable JSON parsing
app.use(express.json());

// Connect to Neon PostgreSQL using DATABASE_URL from Vercel env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Basic test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from SBI OpsVision backend!' });
});

// New route to fetch all branch data
app.get('/api/branches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branch_data ORDER BY branch_name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// (Optional) Route to insert daily branch data (POST)
app.post('/api/branches', async (req, res) => {
  const { branch_name, kyc_pending, kyc_completed } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO branch_data (branch_name, kyc_pending, kyc_completed) 
       VALUES ($1, $2, $3) RETURNING *`,
      [branch_name, kyc_pending, kyc_completed]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

module.exports = app;
