#!/usr/bin/env node

/**
 * complete_todoist.js
 * Marks a Todoist task as complete by task ID.
 *
 * Usage:
 *   node complete_todoist.js <task_id>
 *
 * Example:
 *   node complete_todoist.js 1234567890
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?s*$/);
        if (match) {
            process.env[match[1]] = match[2].trim();
        }
    });
} catch (error) {
    // Ignore error
}

const API_TOKEN = process.env.TODOIST_API_TOKEN;

if (!API_TOKEN) {
    console.error('Error: TODOIST_API_TOKEN is not set.');
    process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node complete_todoist.js <task_id>');
    process.exit(1);
}

const taskId = args[0];

const options = {
    hostname: 'api.todoist.com',
    path: `/api/v1/tasks/${taskId}/close`,
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Length': 0
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 204) {
            console.log(`✅ Task ${taskId} marked as complete.`);
        } else {
            console.error(`Error: Todoist API returned status code ${res.statusCode}`);
            console.error(data);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`Error connecting to Todoist API: ${e.message}`);
});

req.end();
