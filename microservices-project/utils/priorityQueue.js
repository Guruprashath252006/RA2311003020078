const TYPE_PRIORITY = {
    "Result": 5,
    "Placement": 3,
    "Event": 1
};

const SCALE_FACTOR = 1000000000000;

function calculateNotificationPriority(notification) {
    if (!notification || !notification.Timestamp) return 0;
    
    const timestamp = new Date(notification.Timestamp).getTime();
    const typeScore = TYPE_PRIORITY[notification.Type] || 0;
    
    const finalScore = timestamp + (typeScore * SCALE_FACTOR);
    return finalScore;
}

function buildPriorityFeed(notifications, limit = 10) {
    if (!notifications || notifications.length === 0) {
        return [];
    }

    const priorityFeed = [];
    
    for (const item of notifications) {
        if (!item) continue;
        
        const currentScore = calculateNotificationPriority(item);
        
        let idx = priorityFeed.length - 1;
        
        if (priorityFeed.length < limit) {
            priorityFeed.push({ ...item, _score: currentScore });
            idx = priorityFeed.length - 2;
        } else if (currentScore > priorityFeed[limit - 1]._score) {
            priorityFeed[limit - 1] = { ...item, _score: currentScore };
            idx = limit - 2;
        } else {
            continue; 
        }
        
        while (idx >= 0 && priorityFeed[idx + 1]._score > priorityFeed[idx]._score) {
            const tempNode = priorityFeed[idx];
            priorityFeed[idx] = priorityFeed[idx + 1];
            priorityFeed[idx + 1] = tempNode;
            idx--;
        }
    }
    
    const cleanFeed = priorityFeed.map(node => {
        const { _score, ...originalData } = node;
        return originalData;
    });
    
    return cleanFeed;
}

module.exports = { buildPriorityFeed };
