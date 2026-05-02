import dotenv from 'dotenv';

dotenv.config();

const getTypeWeight = (type) => {
    if (type.toLowerCase() === 'placement') return 3;
    if (type.toLowerCase() === 'result') return 2;
    if (type.toLowerCase() === 'event') return 1;
    return 0;
};

const comparePriority = (a, b) => {
    const weightA = getTypeWeight(a.Type);
    const weightB = getTypeWeight(b.Type);
    if (weightA !== weightB) {
        return weightB - weightA; 
    }
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeB - timeA; 
};

const insertTop10 = (top10, notification) => {
    let i = top10.length - 1;
    if (top10.length < 10) {
        top10.push(notification);
        i = top10.length - 2;
    } else if (comparePriority(notification, top10[9]) < 0) {
        top10[9] = notification;
        i = 8;
    } else {
        return;
    }

    while (i >= 0 && comparePriority(top10[i + 1], top10[i]) < 0) {
        const temp = top10[i];
        top10[i] = top10[i + 1];
        top10[i + 1] = temp;
        i--;
    }
};

const main = async () => {
    try {
        const token = process.env.ACCESS_TOKEN;
        const response = await fetch('http://20.207.122.201/evaluation-service/notifications', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        const notifications = data.notifications;

        const top10 = [];
        for (const notification of notifications) {
            insertTop10(top10, notification);
        }

        console.log(JSON.stringify(top10, null, 2));

    } catch (error) {
    }
};

main();
