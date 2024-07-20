import React, { useState } from 'react';
import './App.css';

function App() {
  const [isNavigationActive, setNavigationActive] = useState(false);

  const handleStartNavigation = () => {
    // Simulate voice recognition and text comparison
    const userResponse = prompt("Would you like to start navigation? (yes/no)").toLowerCase();
    if (userResponse === 'yes') {
      setNavigationActive(true);
      alert("Navigation started. Where are you heading to?");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Glasses System</h1>
        <button className="nav-button" onClick={handleStartNavigation}>Start Navigation</button>
        {isNavigationActive && (
          <div className="pop-up">
            <p>Where are you heading to?</p>
            {/* Add more functionality as needed */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
