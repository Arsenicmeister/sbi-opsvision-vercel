import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  const filePath = path.join(process.cwd(), 'data', 'submissions.json');

  try {
    let existing = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath);
      existing = JSON.parse(raw);
    }

    existing.push({ ...data, timestamp: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    res.status(200).json({ message: 'Data submitted successfully' });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
