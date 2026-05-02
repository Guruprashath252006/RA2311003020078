import React from 'react';
import NotificationFeed from './components/NotificationFeed';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Campus Hub</h1>
        <p>Real-time Priority Notifications</p>
      </header>
      
      <main>
        <NotificationFeed />
      </main>
    </div>
  );
}

export default App;