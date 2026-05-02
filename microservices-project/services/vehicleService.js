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
        appLog(`Error: ${error.message}`);
        return [];
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
        appLog(`Error: ${error.message}`);
        return [];
    }
}

module.exports = { fetchVehicles, fetchDepots };
