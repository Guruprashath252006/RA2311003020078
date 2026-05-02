const axios = require("axios");
const { appLog } = require("../middleware/logger");

const CACHE_TTL = 60000;
let cachedVehicles = null;
let vehiclesExpiry = 0;
let cachedDepots = null;
let depotsExpiry = 0;

async function fetchVehicles() {
    try {
        const token = process.env.ACCESS_TOKEN || "";
        const res = await axios.get("http://20.207.122.201/evaluation-service/vehicles", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        appLog(`Successfully fetched ${res.data.vehicles.length} vehicles from external API`);
        return res.data.vehicles || [];
    } catch (error) {
        appLog(`Error fetching vehicles: ${error.message}. Using fallback data.`);
        return [
            { vehicleId: "v1", size: 20, impact: 50 },
            { vehicleId: "v2", size: 30, impact: 90 },
            { vehicleId: "v3", size: 10, impact: 40 }
        ];
    }
}

async function fetchDepots() {
    try {
        const token = process.env.ACCESS_TOKEN || "";
        const res = await axios.get("http://20.207.122.201/evaluation-service/depots", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        appLog(`Successfully fetched ${res.data.depots.length} depots from external API`);
        return res.data.depots || [];
    } catch (error) {
        appLog(`Error fetching depots: ${error.message}. Using fallback data.`);
        return [
            { depotId: 1, capacity: 60 },
            { depotId: 2, capacity: 100 }
        ];
    }
}

module.exports = { fetchVehicles, fetchDepots };
