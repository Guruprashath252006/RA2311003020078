import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert,
  Paper
} from '@mui/material';
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
        
        const response = await fetch('/api/notifications?limit=20');
        
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
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && notifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">Connection Failed</Typography>
        <Typography variant="body2">{error}</Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Recent Activity
        </Typography>
      </Box>

      {notifications.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.1)'
          }} 
          elevation={0}
        >
          <Typography color="text.secondary">No notifications found.</Typography>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={1}>
          {notifications.map((notif, index) => (
            <NotificationCard 
              key={notif.id || notif.ID || notif._id || index} 
              notification={notif} 
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default NotificationFeed;
