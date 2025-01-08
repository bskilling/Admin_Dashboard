"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = __importDefault(require("./utils/db"));
require("dotenv").config();

// Import required modules
const https = require('https');
const fs = require('fs');

// Load SSL certificate and key files from environment variables
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

// Create HTTPS server
https.createServer(options, app_1.app).listen(process.env.HTTPS_PORT, () => {
    console.log(`Server is connected with port ${process.env.HTTPS_PORT}`);
    (0, db_1.default)();
});

// Also, keep the HTTP server for fallback (optional)
app_1.app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
});
