import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';

const NotificationCard = ({ notification }) => {
  const mainMessage = notification.description || notification.Description || notification.body || notification.Message || notification.message || 'No details provided.';
  const category = notification.notificationType || notification.Type || notification.type || 'Notice';
  const subTitle = notification.title || notification.Title || notification.heading || `New ${category} Alert`;
  const priority = notification.priorityScore || notification.Priority || notification.priority || 0;
  
  let dateStr = 'Just now';
  const timestamp = notification.createdAt || notification.Timestamp || notification.date || notification.timestamp;
  if (timestamp) {
    try {
      const d = new Date(timestamp);
      dateStr = d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch(e) {}
  }

  // Determine Chip Color based on category
  let chipColor = 'default';
  const catLower = category.toLowerCase();
  if (catLower === 'result') chipColor = 'error';
  else if (catLower === 'placement') chipColor = 'warning';
  else if (catLower === 'event') chipColor = 'secondary';
  else if (catLower === 'notice') chipColor = 'info';

  return (
    <Card 
      elevation={3} 
      sx={{ 
        mb: 2, 
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateX(4px)' }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
              {subTitle}
            </Typography>
            <Typography variant="h6" component="h3" color="text.primary" sx={{ mt: 0.5, fontWeight: 500 }}>
              {mainMessage}
            </Typography>
          </Box>
          <Chip label={category} color={chipColor} size="small" sx={{ fontWeight: 'bold' }} />
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} pt={1} borderTop="1px solid rgba(255,255,255,0.05)">
          <Typography variant="caption" color="text.secondary">
            {dateStr}
          </Typography>
          {priority > 0 && (
            <Typography variant="caption" color="text.secondary" fontWeight="500">
              Priority Level: {priority}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
