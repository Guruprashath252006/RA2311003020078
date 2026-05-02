const axios = require("axios");
const { appLog } = require("../middleware/logger");

const CACHE_TTL = 60000;
let cachedData = null;
let cacheExpiry = 0;

async function fetchNotifications() {
    try {
        const token = process.env.ACCESS_TOKEN || "";
        const res = await axios.get("http://20.207.122.201/evaluation-service/notifications", {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Log the success (no console logs allowed)
        appLog(`Successfully fetched ${res.data.notifications.length} notifications from external API`);
        return res.data.notifications || [];
    } catch (error) {
        appLog(`Error fetching notifications: ${error.message}.`);
        // We return an empty array if the API fails so the UI shows 'No notifications found'
        // instead of hardcoded recommendations.
        return [];
    }
}

module.exports = { fetchNotifications };
