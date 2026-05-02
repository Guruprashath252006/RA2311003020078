import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Log } from 'logging_middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const solveKnapsack = (vehicles, capacity) => {
    const n = vehicles.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = vehicles[i - 1];
        for (let w = 0; w <= capacity; w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - Duration] + Impact);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    let res = dp[n][capacity];
    let w = capacity;
    const chosenTasks = [];

    for (let i = n; i > 0 && res > 0; i--) {
        if (res === dp[i - 1][w]) {
            continue;
        } else {
            chosenTasks.push(vehicles[i - 1].TaskID);
            res -= vehicles[i - 1].Impact;
            w -= vehicles[i - 1].Duration;
        }
    }

    return {
        maxImpact: dp[n][capacity],
        tasks: chosenTasks.reverse()
    };
};

app.get('/schedule', async (req, res) => {
    try {
        await Log('backend', 'info', 'controller', 'Received scheduling request');

        const token = process.env.ACCESS_TOKEN;

        const depotsResponse = await fetch('http://20.207.122.201/evaluation-service/depots', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!depotsResponse.ok) throw new Error('Failed to fetch depots');
        const depotsData = await depotsResponse.json();

        const vehiclesResponse = await fetch('http://20.207.122.201/evaluation-service/vehicles', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!vehiclesResponse.ok) throw new Error('Failed to fetch vehicles');
        const vehiclesData = await vehiclesResponse.json();

        const results = depotsData.depots.map(depot => {
            const result = solveKnapsack(vehiclesData.vehicles, depot.MechanicHours);
            return {
                depotId: depot.ID,
                capacity: depot.MechanicHours,
                ...result
            };
        });

        await Log('backend', 'info', 'controller', 'Scheduling computed successfully');
        res.json({ results });
    } catch (error) {
        await Log('backend', 'error', 'controller', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
