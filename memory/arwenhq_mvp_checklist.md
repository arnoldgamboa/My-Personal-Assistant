# ArwenHQ — MVP Pre-Launch Checklist

> Last updated: 2026-03-11
> Source: Arnold's brain dump, cross-referenced with ArwenHQ PRD v1.0
> PRD: `resources/references/ArwenHQ_PRD.md`

---

## 🎯 Suggested Priority Order (as of 2026-03-11)

### Do First — This Week (Blockers / Foundational)
1. **Verify Brevo email end-to-end** — Everything downstream depends on it: invites, account activation, notifications. Nothing else can be properly tested without it.
2. **[BUG] Team Chat ghost text fix** — ~30 min fix. Knock it out while warming up in the codebase.
3. **Settings → Client & User onboarding journey** — Entry point for every new user. Pairs with Brevo once email works.
4. **Inbox redesign + unread counter fix** — Users hit this constantly; broken counter erodes trust fast.

### This Week / Next (Core UX)
5. Dashboard — connect to real data, add project summary + quick actions
6. Project > Tasks — default category templates per vertical

### Hold — Needs Decision First
7. **Reports** — Don't build blind. Spend 30 min sketching what an agency owner wants to see before writing code.
8. **Invoice Generation** — Biggest scope item. Was out of PRD v1.0 scope but reconsidering as launch differentiator. **Decide this week** — if in, it needs to be on the schedule now. May isn't far.

### Nice-to-Have (Not Launch-Blocking)
- Favorites + Sidebar hide/show
- Schedule testing (lower urgency)
- PRD alignment checks (WebSocket, IndexedDB, search, mobile, Docker)

---

## Status Key
- [ ] = Not started
- [~] = In progress
- [x] = Done

---

## 🖥️ Dashboard
- [ ] Connect welcome message to real user data (currently hardcoded "Joyce" placeholder)
- [ ] Add project summary section — show active project statuses at a glance
  - Architecture decision: static/cached summary preferred over live AI generation (faster, simpler)
  - Option: generate summary on login, cache it, refresh daily or on significant changes
- [ ] Quick Actions buttons — surface most relevant actions per user role/context

---

## 📥 Inbox
- [ ] Full redesign of Inbox UI
- [ ] Tabs: All | Unread | Mentions | Assignments | Comments — ensure all tabs work correctly
- [ ] Proper notification tagging so items are correctly categorized into tabs
- [ ] Unread counter pill on Inbox label must reflect actual unread count (currently inaccurate)

---

## 💬 Team Chat
- [ ] Bug fix: Remove "Select a conversation first" ghost text from textarea when no conversation selected
- [ ] Add unread message count pill/badge on conversations with new messages

---

## 📅 Schedule
- [ ] Proper end-to-end testing of Schedule module
  - Test event creation, editing, deletion
  - Test recurring events
  - Test all views: Month, Week, Day, Agenda
  - Test timezone handling

---

## 📊 Reports
- [ ] Brainstorm and decide what metrics/views to show
  - Ideas to consider: project health, task completion rates, team activity, overdue tasks, time-to-completion
  - PRD mentions "advanced analytics dashboard" in Professional tier — define MVP version of this
- [ ] Design and implement Reports module

---

## ⚙️ Settings / User & Project Management
- [ ] Proper user journey for adding clients and assigning them to projects
- [ ] Proper user journey for assigning users to projects
- [ ] Add new user role: **Outside Contractor** (beyond Owner/Admin/Member/Guest from PRD)
- [ ] Email invitations and account activation flow via linked emails
- [ ] Verify Brevo email integration is working end-to-end
- [ ] Consider renaming "Settings" to "User & Project Management" or similar — decide on label

---

## 📧 Email
- [ ] Decide on email delivery strategy for users (transactional vs digest vs both)
- [ ] End-to-end email testing with Brevo (invites, notifications, activations)
- [ ] Ensure granular notification preferences work (per PRD: users choose what to receive)

---

## ⭐ Favorites
- [ ] Implement project favorites — user can star/favorite a project
- [ ] Favorited projects appear as shortcuts in the sidebar
- [ ] Architecture note: build "favorites" as a generic system (not project-only) so future items (docs, tasks, people) can also be favorited

---

## 🗂️ Sidebar
- [ ] Implement hide/show toggle for sidebar (collapse/expand)

---

## 🚀 Client & User Onboarding
- [ ] Design and implement onboarding flow for new clients
- [ ] Design and implement onboarding flow for new users (internal team + contractors)
- [ ] Account activation email must be part of this flow

---

## ✅ Project > Tasks
- [ ] Set up default Todo category templates based on target client verticals:
  - **Digital Agency** — e.g., Strategy, Design, Development, QA, Client Review, Launch
  - **Schools / Education** — e.g., Curriculum, Admin, Events, Communication
  - **Churches** — e.g., Services, Outreach, Admin, Volunteer, Media
- [ ] On new project creation, suggest a category template based on project type
- [ ] These suggested categories become default lists but remain fully editable

---

## 🧾 Invoice Generation (Pre-Launch Big Feature)
> ✅ DECISION (2026-03-13): **IN MVP.** Arnold confirmed this is a launch feature. Time tracking was out of PRD v1.0 scope but has been added as a pre-launch differentiator targeting the Agency Owner persona.

- [x] Decision needed: Confirm this is going into MVP or post-MVP v1.1 — **CONFIRMED IN** ✅
- [ ] Time tracking on Todos (log time spent per task)
- [ ] Invoice generator that pulls time-tracked tasks automatically
- [ ] Invoice line items editable before sending
- [ ] Invoice output: PDF generation minimum; email delivery via Brevo
- [ ] This feature directly supports Agency Owner persona (primary target market)

---

## 🔁 PRD Alignment Notes

Things from PRD that may need status check:
- [ ] Optimistic UI / local-first IndexedDB sync — confirm this is working correctly
- [ ] WebSocket real-time updates — verify multiplayer sync
- [ ] Global search — is it functional across tasks, docs, files, comments?
- [ ] Mobile responsiveness — test on actual mobile devices before launch
- [ ] Docker Compose self-hosted deployment — test clean install end-to-end

---

## 🚫 Confirmed Out of Scope for MVP (per PRD)
- Native iOS/Android apps
- Gantt charts
- Third-party integrations (Slack, Zapier, GitHub)
- Custom fields
- Public REST API
- Workflow automations
- 2FA (Phase 2)
