import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'submissions.json');

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(200).json([]); // No data yet
    }

    const raw = fs.readFileSync(filePath);
    const data = JSON.parse(raw);

    const latestByBranch = {};
    data.forEach(entry => {
      latestByBranch[entry.branch_name] = entry;
    });

    res.status(200).json(Object.values(latestByBranch));
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
