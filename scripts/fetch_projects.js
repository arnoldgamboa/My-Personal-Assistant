#!/usr/bin/env node

/**
 * fetch_projects.js
 * Lists all Todoist projects with their IDs and names.
 *
 * Usage:
 *   node fetch_projects.js
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

const options = {
    hostname: 'api.todoist.com',
    path: '/api/v1/projects',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`Error: Todoist API returned status code ${res.statusCode}`);
            console.error(data);
            process.exit(1);
        }

        try {
            const body = JSON.parse(data);
            const projects = body.results || body;

            if (!Array.isArray(projects) || projects.length === 0) {
                console.log('No projects found.');
                return;
            }

            console.log('\n### 📂 Your Todoist Projects\n');
            projects.forEach(p => {
                const indent = p.parent_id ? '  └─ ' : '';
                const inbox = p.is_inbox_project ? ' (Inbox)' : '';
                console.log(`${indent}[${p.id}] ${p.name}${inbox}`);
            });
            console.log(`\nTotal: ${projects.length} project(s)`);

        } catch (e) {
            console.error('Error parsing response:', e);
        }
    });
});

req.on('error', (e) => {
    console.error(`Error connecting to Todoist API: ${e.message}`);
});

req.end();
