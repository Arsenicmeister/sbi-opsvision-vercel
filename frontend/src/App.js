import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DataEntryForm from './components/DataEntryForm';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <nav className="navigation">
        <div className="nav-brand">
          <h1>OpsVision 360</h1>
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'entry' ? 'active' : ''}`}
            onClick={() => setActiveTab('entry')}
          >
            📝 Data Entry
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' ? <Dashboard /> : <DataEntryForm />}
      </main>
    </div>
  );
}

export default App;
