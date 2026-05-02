import React from 'react';

const NotificationCard = ({ notification }) => {
  const title = notification.title || notification.Title || notification.heading || 'New Notification';
  const description = notification.description || notification.Description || notification.body || notification.Message || notification.message || 'No details provided.';
  const type = notification.notificationType || notification.Type || notification.type || 'Event';
  const priority = notification.priorityScore || notification.Priority || notification.priority || 0;
  
  let dateStr = 'Just now';
  if (notification.createdAt || notification.Timestamp || notification.date || notification.timestamp) {
    try {
      const d = new Date(notification.createdAt || notification.Timestamp || notification.date || notification.timestamp);
      dateStr = d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch(e) {}
  }

  const badgeClass = `notification-badge badge-${type.toLowerCase()}`;

  return (
    <div className="glass-card">
      <div className="notification-header">
        <h3 className="notification-title">{title}</h3>
        <span className={badgeClass}>{type}</span>
      </div>
      
      <p className="notification-body">
        {description}
      </p>
      
      <div className="notification-footer">
        <span className="timestamp">{dateStr}</span>
        {priority > 0 && (
          <span className="priority-indicator" style={{color: 'var(--accent)'}}>
            Priority Score: {priority}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
