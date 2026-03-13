---
description: Morning routine workflow — starts the day with a tri-vocational briefing, clears the inbox, and sets daily priorities across all three roles
---

# Morning Routine Workflow

Run this every morning to start the day focused and organized across Arnold's three roles.

## Steps

1. **Generate Daily Briefing**
   - Use the `skills/daily_briefing/SKILL.md` skill
   - Read `context/projects.md`, `context/goals.md`, `context/people.md`
   - Read `context/ballys.md` for any Bally's tasks/meetings Arnold has shared
   - Read `context/lifecity_church.md` for preaching schedule and sermon prep status
   - Use current system date/time

2. **Clear the Inbox**
   - Read all items in `inbox/`
   - Run `skills/task_capture/SKILL.md` on any uncaptured items
   - Route items to projects, memory, or context as appropriate
   - Report how many items were cleared

3. **Run Reddit Scanner**
   - Run `skills/reddit_scanning/SKILL.md` to fetch and analyze the latest posts from the target subreddits.
   - Present the 5 top engagement opportunities with suggested drafts.

4. **Surface Today's Priorities — All Three Roles**
   - **Solopreneur (8AM–1PM):** Top tasks from active projects and recurring commitments
   - **Bally's (1PM–8PM):** Any meetings, emails, or tasks Arnold has flagged
   - **Church:** Sermon prep status if it's Thursday–Sunday and Arnold is preaching
   - Confirm Arnold's top 3 priorities across all roles
   - Ask: "Does this look right or would you like to shift anything?"

5. **Check for Meetings**
   - Ask Arnold if there are any meetings today (solopreneur or Bally's)
   - If yes, offer to run `skills/meeting_prep/SKILL.md` for each

6. **Time Block Awareness**
   - Remind Arnold of the day's structure:
     - 8AM–1PM: Solopreneur deep work
     - 1PM–8PM: Bally's
     - Evening: Church (if applicable)
   - Surface any deadlines or time-sensitive items from `context/projects.md`
   - Note if today is blocked by meetings (>3 hours) and propose adjusted plan

7. **Sermon Prep Check (Thursday–Sunday only)**
   - If it's Thursday, Friday, Saturday, or Sunday:
     - Check `context/lifecity_church.md` — is Arnold preaching this Sunday?
     - If yes and prep hasn't started: "Ready to start sermon prep? What passage/topic?"
     - If yes and prep is in progress: Surface where he left off
     - If not preaching: Skip entirely

## Completion

Report: "Morning setup complete. Here's your day: [summary across all 3 roles]"
