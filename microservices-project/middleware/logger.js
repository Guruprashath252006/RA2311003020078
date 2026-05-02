const fs = require("fs");

function logger(req, res, next) {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFileSync("logs.txt", log);
    next();
}

function appLog(message) {
    const log = `${new Date().toISOString()} - APP_LOG: ${message}\n`;
    fs.appendFileSync("logs.txt", log);
}

module.exports = { logger, appLog };
