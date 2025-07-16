// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // You can style cards here

const metrics = [
  { key: 'kyc_updation', label: 'KYC Updation' },
  { key: 'deduplication', label: 'Deduplication' },
  { key: 'edd', label: 'EDD' },
  { key: 'ria', label: 'RIA' },
  { key: 'deaf_accounts', label: 'DEAF Accounts' },
  { key: 'ccsc_updation', label: 'CCSC Updation' },
  { key: 'zta_bgl_attended', label: 'ZTA BGL' },
  { key: 'current_dqi', label: 'Current DQI' },
  { key: 'legacy_dqi', label: 'Legacy DQI' },
];

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <div className="dashboard">
      <h2>Branch Performance Dashboard</h2>
      {data.map((branch, idx) => (
        <div key={idx} className="branch-card">
          <h3>{branch.branch_name}</h3>
          {metrics.map((metric) => {
            const val = branch[metric.key] || 0;
            const color =
              val >= 80 ? 'green' : val >= 40 ? 'orange' : 'red';
            return (
              <div key={metric.key}>
                <label>{metric.label}: {val}%</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${val}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
