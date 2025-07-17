import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const metrics = [
  { key: 'kyc_updation', label: 'KYC Updation', target: 85 },
  { key: 'deduplication', label: 'Deduplication', target: 90 },
  { key: 'edd', label: 'EDD', target: 80 },
  { key: 'ria', label: 'RIA', target: 75 },
  { key: 'deaf_accounts', label: 'DEAF Accounts', target: 95 },
  { key: 'ccsc_updation', label: 'CCSC Updation', target: 80 },
  { key: 'zta_bgl_attended', label: 'ZTA BGL Attended', target: 85 },
  { key: 'current_dqi', label: 'Current DQI', target: 90 },
  { key: 'legacy_dqi', label: 'Legacy DQI', target: 85 },
];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value, target) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return '#28a745'; // Green
    if (percentage >= 70) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  const getStatusText = (value, target) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 70) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>OpsVision 360 - Branch Performance Dashboard</h1>
        <div className="last-updated">
          Last Updated: {new Date().toLocaleString()}
        </div>
      </header>

      <div className="dashboard-grid">
        {data.map((branch, idx) => (
          <div key={idx} className="branch-card">
            <h3 className="branch-name">{branch.branch_name}</h3>
            
            <div className="metrics-grid">
              {metrics.map((metric) => {
                const value = branch[metric.key] || 0;
                const percentage = Math.min((value / metric.target) * 100, 100);
                const color = getStatusColor(value, metric.target);
                const status = getStatusText(value, metric.target);
                
                return (
                  <div key={metric.key} className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">{metric.label}</span>
                      <span className="metric-value">{value}%</span>
                    </div>
                    
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      <div className="target-line" style={{ left: '100%' }}>
                        Target: {metric.target}%
                      </div>
                    </div>
                    
                    <div className="metric-status" style={{ color }}>
                      {status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
