// frontend/src/App.js
import React from 'react';
import Dashboard from './components/Dashboard';  // ✅ Make sure this path is correct

function App() {
  return (
    <div className="App">
      <Dashboard />   {/* ✅ This renders the dashboard */}
    </div>
  );
}

export default App;


