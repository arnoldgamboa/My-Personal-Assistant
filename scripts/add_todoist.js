#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            // Remove carriage return if present
            process.env[match[1]] = match[2].trim();
        }
    });
} catch (error) {
    // Ignore error
}

const API_TOKEN = process.env.TODOIST_API_TOKEN;

if (!API_TOKEN) {
    console.error("Error: TODOIST_API_TOKEN is not set.");
    process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Usage: node add_todoist.js <task_content> [due_string] [priority_1_to_4]");
    process.exit(1);
}

const content = args[0];
const dueString = args[1] || 'today';
// Default to 1 (normal). 4 is the highest urgency in Todoist API (Red).
const priority = args[2] ? parseInt(args[2], 10) : 1;

const postData = JSON.stringify({
    content: content,
    due_string: dueString,
    priority: priority
});

const options = {
    hostname: 'api.todoist.com',
    path: '/api/v1/tasks',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            const task = JSON.parse(data);
            console.log(`Task added successfully: "${task.content}" (ID: ${task.id})`);
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

req.write(postData);
req.end();
