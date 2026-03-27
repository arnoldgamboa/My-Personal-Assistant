#!/usr/bin/env node

/**
 * add_todoist.js
 * Adds a task to Todoist, with optional hashtag project routing.
 *
 * Usage:
 *   node add_todoist.js <task_content> [due_string] [priority_1_to_4]
 *
 * Hashtag project routing (detected automatically in task_content):
 *   #solo / #solopreneur   → Solo project
 *   #ballys / #bally's     → Ballys project
 *   #lifecity / #church    → LifeCity project
 *   #personal / #finance   → Personal project
 *   (no hashtag)           → Inbox
 *
 * Examples:
 *   node add_todoist.js "Finish ArwenHQ onboarding #solo" "Wednesday" 3
 *   node add_todoist.js "Send TEMPO report #ballys" "Friday"
 *   node add_todoist.js "Send GCash to Manny #lifecity" "Monday"
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
    console.error('Usage: node add_todoist.js <task_content> [due_string] [priority_1_to_4]');
    process.exit(1);
}

// Project ID map — update these if you rename projects in Todoist
const PROJECT_MAP = {
    solo:        '6gCp4j4RPHxWV26x',
    solopreneur: '6gCp4j4RPHxWV26x',
    ballys:      '6gCp4j3WJM89PXRH',
    lifecity:    '6gCp4j6fP5WvQRr4',
    church:      '6gCp4j6fP5WvQRr4',
    personal:    '6gCp4j6R2PV5JCgm',
    finance:     '6gCp4j6R2PV5JCgm',
};

let content = args[0];
const dueString = args[1] || 'today';
const priority = args[2] ? parseInt(args[2], 10) : 1;

// Parse hashtags from content and route to the right project
let projectId = null;
let matchedTag = null;
const hashtagRegex = /#([\w]+)/gi;
let tagMatch;
while ((tagMatch = hashtagRegex.exec(content)) !== null) {
    const tag = tagMatch[1].toLowerCase();
    if (PROJECT_MAP[tag]) {
        projectId = PROJECT_MAP[tag];
        matchedTag = tagMatch[0];
        break;
    }
}

// Strip the matched hashtag from the task title
if (matchedTag) {
    content = content.replace(matchedTag, '').replace(/\s+/g, ' ').trim();
}

const projectLabel = projectId
    ? Object.keys(PROJECT_MAP).find(k => PROJECT_MAP[k] === projectId)
    : 'Inbox';

const payload = { content, due_string: dueString, priority };
if (projectId) payload.project_id = projectId;

const postData = JSON.stringify(payload);

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
            console.log(`✅ Task added: "${task.content}" → Project: ${projectLabel} (ID: ${task.id})`);
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
