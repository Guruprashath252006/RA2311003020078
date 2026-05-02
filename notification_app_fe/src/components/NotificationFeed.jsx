import React, { useState, useEffect } from 'react';
import NotificationCard from './NotificationCard';

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/notifications?limit=10');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setNotifications(data);
        } else if (data && typeof data === 'object') {
          const possibleArray = Object.values(data).find(val => Array.isArray(val));
          if (possibleArray) {
            setNotifications(possibleArray);
          } else {
            setNotifications([data]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError(err.message || "Failed to connect to the notification service.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Optional polling for real-time feel (every 60 seconds)
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && notifications.length === 0) {
    return <div className="loading-spinner"></div>;
  }

  if (error && notifications.length === 0) {
    return (
      <div className="error-message">
        <h3>Connection Failed</h3>
        <p>{error}</p>
        <p style={{marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8}}>
          Please ensure the backend server is running on port 3000 and your ACCESS_TOKEN is valid.
        </p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="glass-card" style={{textAlign: 'center'}}>
        <p>No notifications found. You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {notifications.map((notif, index) => (
        <NotificationCard 
          key={notif.id || notif._id || index} 
          notification={notif} 
        />
      ))}
    </div>
  );
};

export default NotificationFeed;
