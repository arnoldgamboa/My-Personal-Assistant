#!/usr/bin/env node

/**
 * fetch_tasks_by_project.js
 * Fetches all active tasks for a given Todoist project ID.
 * Run fetch_projects.js first to get a list of project IDs.
 *
 * Usage:
 *   node fetch_tasks_by_project.js <project_id> [--all]
 *
 * Options:
 *   --all    Show all tasks (not just today/overdue). Default: today + overdue only.
 *
 * Examples:
 *   node fetch_tasks_by_project.js 2349336453
 *   node fetch_tasks_by_project.js 2349336453 --all
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
    console.error('Usage: node fetch_tasks_by_project.js <project_id> [--all]');
    console.error('Run fetch_projects.js to get your project IDs.');
    process.exit(1);
}

const projectId = args[0];
const showAll = args.includes('--all');

// Priority display map
const PRIORITY_MAP = {
    4: '🔴 P1',
    3: '🟠 P2',
    2: '🔵 P3',
    1: '⚪ P4'
};

const queryString = showAll
    ? `project_id=${projectId}`
    : `project_id=${projectId}&filter=today%20%7C%20overdue`;

const options = {
    hostname: 'api.todoist.com',
    path: `/api/v1/tasks?${queryString}`,
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
            const tasks = body.results || body.tasks || body;

            if (!Array.isArray(tasks) || tasks.length === 0) {
                console.log(showAll
                    ? `No tasks found in project ${projectId}.`
                    : `No tasks due today or overdue in project ${projectId}.`
                );
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Sort: priority desc, then due date asc (no date = last)
            tasks.sort((a, b) => {
                if (b.priority !== a.priority) return b.priority - a.priority;
                const aDate = a.due ? new Date(a.due.date) : Infinity;
                const bDate = b.due ? new Date(b.due.date) : Infinity;
                return aDate - bDate;
            });

            const modeLabel = showAll ? 'All Tasks' : "Today's Tasks";
            console.log(`\n### 📋 ${modeLabel} — Project ${projectId}\n`);

            tasks.forEach((task, index) => {
                const priority = PRIORITY_MAP[task.priority] || '';
                const dueDate = task.due ? task.due.date : null;
                const dueTime = task.due && task.due.datetime
                    ? new Date(task.due.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : null;
                const isOverdue = dueDate && new Date(dueDate) < today;
                const overdueTag = isOverdue ? ' **(OVERDUE)**' : '';
                const dueStr = dueTime
                    ? ` @ ${dueTime}`
                    : dueDate
                        ? ` (due ${dueDate})`
                        : '';
                const section = task.section_id ? '' : ''; // future: could show section name

                console.log(`${index + 1}. [${task.id}] ${priority} ${task.content}${overdueTag}${dueStr}`);
            });

            console.log(`\nTotal: ${tasks.length} task(s)`);

        } catch (e) {
            console.error('Error parsing response:', e);
        }
    });
});

req.on('error', (e) => {
    console.error(`Error connecting to Todoist API: ${e.message}`);
});

req.end();
