---
description: Morning routine workflow — starts the day with a briefing, clears the inbox, and sets daily priorities
---

# Morning Routine Workflow

Run this every morning to start the day focused and organized.

## Steps

1. **Generate Daily Briefing**
   - Use the `skills/daily_briefing/SKILL.md` skill
   - Read `context/projects.md`, `context/goals.md`, `context/people.md`
   - Use current system date/time

2. **Clear the Inbox**
   - Read all items in `inbox/`
   - Run `skills/task_capture/SKILL.md` on any uncaptured items
   - Route items to projects, memory, or context as appropriate
   - Report how many items were cleared

3. **Run Reddit Scanner**
   - Run `skills/reddit_scanning/SKILL.md` to fetch and analyze the latest posts from the target subreddits.
   - Present the 5 top engagement opportunities with suggested drafts.

4. **Surface Today's Priorities**
   - Based on the briefing, inbox review, and Reddit engagement, confirm Arnold's top 3 priorities
   - Ask: "Does this look right or would you like to shift anything?"

4. **Check for Meetings**
   - Ask Arnold if there are any meetings today
   - If yes, offer to run `skills/meeting_prep/SKILL.md` for each

5. **Flag the Day**
   - Surface any deadlines or time-sensitive items from `context/projects.md`
   - Note if today is blocked by meetings (>3 hours) and propose adjusted plan

## Completion

Report: "Morning setup complete. Here's your day: [summary]"
