import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper
} from '@mui/material';
import NotificationCard from './NotificationCard';

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

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

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const filteredNotifications = filterCategory === 'All' 
    ? notifications 
    : notifications.filter(n => {
        const type = n.notificationType || n.Type || n.type || 'Notice';
        return type.toLowerCase() === filterCategory.toLowerCase();
      });

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
        
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="category-filter-label">Filter Type</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={filterCategory}
            label="Filter Type"
            onChange={handleFilterChange}
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}
          >
            <MenuItem value="All">All Notifications</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Notice">Notice</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredNotifications.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.1)'
          }} 
          elevation={0}
        >
          <Typography color="text.secondary">No notifications found in this category.</Typography>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={0}>
          {filteredNotifications.map((notif, index) => (
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
