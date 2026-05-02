require("dotenv").config();
const express = require("express");
const { logger, appLog } = require("./middleware/logger");

const { fetchNotifications } = require("./services/notificationService");
const { fetchVehicles, fetchDepots } = require("./services/vehicleService");

const knapsack = require("./utils/knapsack");
const { buildPriorityFeed } = require("./utils/priorityQueue");

const app = express();
app.use(logger);

// http://localhost:3000/notifications?limit=10
app.get("/notifications", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await fetchNotifications();
        
        if (!data) {
            return res.status(404).json({ error: "No notifications found" });
        }
        
        const priorityFeed = buildPriorityFeed(data, limit);
        res.json(priorityFeed);
    } catch (error) {
        appLog(`Error in /notifications route: ${error.message}`);
        res.status(500).json({ error: "Failed to process notifications" });
    }
});

// http://localhost:3000/schedule
app.get("/schedule", async (req, res) => {
    try {
        const vehicles = await fetchVehicles();
        const depots = await fetchDepots();
        
        if (!vehicles || !depots || depots.length === 0) {
             return res.status(404).json({ error: "Missing required scheduling data" });
        }

        const computedSchedules = depots.map(depot => {
            const capacity = depot.MechanicHours;
            const impactScore = knapsack(vehicles, capacity);
            
            return {
                depotId: depot.ID,
                capacity: capacity,
                maxImpact: impactScore
            };
        });

        res.json({ schedules: computedSchedules });
    } catch (error) {
        appLog(`Error in /schedule route: ${error.message}`);
        res.status(500).json({ error: "Failed to schedule vehicles" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    appLog(`Server running successfully on port ${PORT}`);
});
