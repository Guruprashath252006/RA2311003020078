import React from 'react';

const NotificationCard = ({ notification }) => {
  // Try to safely access the properties returned by the actual API
  const mainMessage = notification.description || notification.Description || notification.body || notification.Message || notification.message || 'No details provided.';
  const category = notification.notificationType || notification.Type || notification.type || 'Notice';
  const subTitle = notification.title || notification.Title || notification.heading || `New ${category} Alert`;
  const priority = notification.priorityScore || notification.Priority || notification.priority || 0;
  
  // Try to format date, fallback to current time string if missing
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

  const badgeClass = `notification-badge badge-${category.toLowerCase()}`;

  return (
    <div className="glass-card">
      <div className="notification-header">
        <div className="header-text">
          <span className="sub-header">{subTitle}</span>
          <h3 className="notification-title">{mainMessage}</h3>
        </div>
        <span className={badgeClass}>{category}</span>
      </div>
      
      <div className="notification-footer">
        <span className="timestamp">{dateStr}</span>
        {priority > 0 && (
          <span className="priority-indicator">
            Priority Level: {priority}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
