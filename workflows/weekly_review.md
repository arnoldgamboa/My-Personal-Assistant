---
description: Weekly review workflow — reflects on the past week, cleans up context, and plans the week ahead
---

# Weekly Review Workflow

Run at the end of each week (Friday afternoon) or start of the next (Monday morning).

## Steps

1. **Reflect on the Past Week**
   - Ask Arnold: "What were the wins this week? What didn't get done?"
   - Log wins and incomplete items in `memory/logs/` under the current week's entry

2. **Review Active Projects**
   - Read `context/projects.md`
   - For each active project, ask: "Any status updates?"
   - Update project statuses in `context/projects.md`

3. **Process Decisions**
   - Ask: "Any decisions made this week worth capturing?"
   - Append to `memory/decisions.md`

4. **Review Goals**
   - Read `context/goals.md`
   - Check: Are current projects aligned to current goals?
   - Flag any drift: "⚠️ [Project X] doesn't map to any current goal — is it still a priority?"

5. **Plan Next Week & Content**
   - Ask Arnold for top 3 priorities for next week
   - Use `agents/scheduler_agent.md` to suggest time blocks if requested
   - **Content Creation:** Use `skills/blog_writing/SKILL.md` to ideate and draft the Tuesday blog post for "Shipped & Unfinished" based on the past week's wins, struggles, or decisions.
   - Note next week's priorities and the proposed blog topic in `memory/logs/` for reference

6. **Inbox Zero**
   - Run `skills/task_capture/SKILL.md` on any remaining `inbox/` items
   - Confirm inbox is clear before closing

## Completion

Report: "Weekly review complete. Here's the summary: [wins, decisions, next week priorities]"
