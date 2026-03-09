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
            process.env[match[1]] = match[2];
        }
    });
} catch (error) {
    console.error("Warning: Could not read .env file. Ensure TODOIST_API_TOKEN is set.");
}

const API_TOKEN = process.env.TODOIST_API_TOKEN;

if (!API_TOKEN) {
    console.error("Error: TODOIST_API_TOKEN is not set in the environment or .env file.");
    process.exit(1);
}

// Map prioritize to importance levels
const PRIORITY_MAP = {
    4: '🔴 Priority 1', // Todoist API priority 4 is lowest number in UI (p1)
    3: '🟠 Priority 2',
    2: '🔵 Priority 3',
    1: '⚪ Priority 4'  // Default
};

const options = {
    hostname: 'api.todoist.com',
    path: '/api/v1/tasks?filter=today%20|%20overdue',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`Error: Todoist API returned status code ${res.statusCode}`);
            console.error(data);
            process.exit(1);
        }

        try {
            const responseBody = JSON.parse(data);
            const tasks = responseBody.results || responseBody.tasks || responseBody; // Handle both wrapped and direct array

            if (!Array.isArray(tasks) || tasks.length === 0) {
                console.log("No tasks due today or overdue.");
                return;
            }

            // Sort tasks by priority (highest first) then by due date
            tasks.sort((a, b) => b.priority - a.priority);

            // Print top 3 priority tasks
            console.log("\n### 🎯 Today's Top Priorities (from Todoist)");
            const topTasks = tasks.slice(0, 3);
            topTasks.forEach((task, index) => {
                const dueStr = task.due && task.due.datetime ? ` at ${new Date(task.due.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '';
                const priorityStr = PRIORITY_MAP[task.priority] ? `[${PRIORITY_MAP[task.priority]}] ` : '';
                const overdueMark = task.due && task.due.is_recurring === false && new Date(task.due.date) < new Date(new Date().setHours(0, 0, 0, 0)) ? ' **(OVERDUE)**' : '';
                console.log(`${index + 1}. ${priorityStr}${task.content}${overdueMark}${dueStr}`);
            });

            // Print scheduled meetings / specific time tasks
            const timeTasks = tasks.filter(task => task.due && task.due.datetime);
            console.log("\n### 📅 Schedule (Task times)");
            if (timeTasks.length > 0) {
                // Sort by time
                timeTasks.sort((a, b) => new Date(a.due.datetime) - new Date(b.due.datetime));
                timeTasks.forEach(task => {
                    const time = new Date(task.due.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    console.log(`- ${time} — ${task.content}`);
                });
            } else {
                console.log("- (No time-specific tasks scheduled today)");
            }

            console.log(`\n*(+ ${Math.max(0, tasks.length - 3)} other tasks pending today/overdue)*`);

        } catch (e) {
            console.error("Error parsing response:", e);
        }
    });
});

req.on('error', (e) => {
    console.error(`Error connecting to Todoist API: ${e.message}`);
});

req.end();
