#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env
const envPath = path.join(__dirname, '..', '.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) process.env[match[1]] = match[2];
    });
} catch (e) {
    console.error("Warning: Could not read .env file.");
}

const API_TOKEN = process.env.TODOIST_API_TOKEN;
const PROJECT_ID = '6Crfv5j9QxMJ66M6';

if (!API_TOKEN) {
    console.error("Error: TODOIST_API_TOKEN not set.");
    process.exit(1);
}

function apiRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'api.todoist.com',
            path,
            method,
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
            }
        };
        const req = https.request(options, res => {
            let response = '';
            res.on('data', chunk => response += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(response ? JSON.parse(response) : {});
                } else {
                    reject(new Error(`API error ${res.statusCode}: ${response}`));
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function addTask(content, sectionId = null, priority = 1) {
    const body = { content, project_id: PROJECT_ID, priority };
    if (sectionId) body.section_id = sectionId;
    const task = await apiRequest('POST', '/api/v1/tasks', body);
    console.log(`  ✅ Added: ${content}`);
    return task;
}

async function addSection(name) {
    const section = await apiRequest('POST', '/api/v1/sections', {
        name,
        project_id: PROJECT_ID
    });
    console.log(`\n📁 Section: ${name}`);
    return section.id;
}

async function main() {
    console.log('Adding ArwenHQ MVP tasks to Todoist...\n');

    // Dashboard
    let sid = await addSection('🖥️ Dashboard');
    await addTask('Connect welcome message to real user data (remove hardcoded placeholder)', sid);
    await addTask('Add project summary section on Dashboard (cached on login)', sid);
    await addTask('Add Quick Actions buttons — surface most relevant actions per user role', sid);

    // Inbox
    sid = await addSection('📥 Inbox');
    await addTask('Redesign Inbox UI', sid, 2);
    await addTask('Implement tabs: All | Unread | Mentions | Assignments | Comments', sid);
    await addTask('Fix notification tagging so items are correctly categorized into tabs', sid);
    await addTask('Fix unread counter pill on Inbox label to reflect actual unread count', sid, 2);

    // Team Chat
    sid = await addSection('💬 Team Chat');
    await addTask('[BUG] Remove "Select a conversation first" ghost text from textarea', sid, 3);
    await addTask('Add unread message count badge on conversations with new messages', sid);

    // Schedule
    sid = await addSection('📅 Schedule');
    await addTask('End-to-end testing: event creation, editing, deletion', sid);
    await addTask('Test recurring events, all views (Month/Week/Day/Agenda), timezone handling', sid);

    // Reports
    sid = await addSection('📊 Reports');
    await addTask('[DECISION] Brainstorm and define what to show in Reports module', sid, 2);
    await addTask('Design and implement Reports module (after decision)', sid);

    // Settings
    sid = await addSection('⚙️ Settings / User & Project Management');
    await addTask('Build proper user journey: adding clients and assigning to projects', sid, 2);
    await addTask('Build proper user journey: assigning users to projects', sid);
    await addTask('Add new user role: Outside Contractor', sid);
    await addTask('Build email invite and account activation flow', sid, 2);
    await addTask('Verify Brevo email integration end-to-end', sid, 4);
    await addTask('[DECISION] Rename "Settings" — consider "User & Project Management"', sid);

    // Email
    sid = await addSection('📧 Email');
    await addTask('[DECISION] Define email delivery strategy (transactional vs digest vs both)', sid, 2);
    await addTask('End-to-end email testing with Brevo: invites, notifications, activations', sid, 3);
    await addTask('Verify granular notification preferences work per user', sid);

    // Favorites
    sid = await addSection('⭐ Favorites');
    await addTask('Implement project favorites (star/favorite a project)', sid);
    await addTask('Show favorited projects as shortcuts in sidebar', sid);
    await addTask('Build favorites as a generic system (not project-only — future-proof)', sid);

    // Sidebar
    sid = await addSection('🗂️ Sidebar');
    await addTask('Implement sidebar hide/show toggle (collapse/expand)', sid);

    // Onboarding
    sid = await addSection('🚀 Client & User Onboarding');
    await addTask('Design and implement onboarding flow for new clients', sid, 2);
    await addTask('Design and implement onboarding flow for new users (team + contractors)', sid, 2);

    // Tasks
    sid = await addSection('✅ Project > Tasks');
    await addTask('Set up default Todo category templates: Digital Agency vertical', sid);
    await addTask('Set up default Todo category templates: Schools / Education vertical', sid);
    await addTask('Set up default Todo category templates: Churches vertical', sid);
    await addTask('On new project creation, prompt to select category template', sid);

    // Invoice
    sid = await addSection('🧾 Invoice Generation');
    await addTask('[DECISION] Confirm invoice generation is in MVP or deferred to v1.1', sid, 4);
    await addTask('Build time tracking on Todos (log time spent per task)', sid);
    await addTask('Build invoice generator pulling time-tracked tasks automatically', sid);
    await addTask('Invoice line items editable before sending', sid);
    await addTask('Invoice PDF generation + email delivery via Brevo', sid);

    // PRD checks
    sid = await addSection('🔁 PRD Alignment Checks');
    await addTask('Verify optimistic UI / local-first IndexedDB sync is working correctly', sid);
    await addTask('Verify WebSocket real-time multiplayer sync', sid);
    await addTask('Verify global search works across tasks, docs, files, comments', sid);
    await addTask('Test mobile responsiveness on actual devices', sid);
    await addTask('Test Docker Compose self-hosted clean install end-to-end', sid);

    console.log('\n✅ All tasks added successfully!');
}

main().catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
});
