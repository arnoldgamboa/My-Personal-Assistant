---
description: Project kickoff workflow — captures a new project into the PA system with full context, goals, and initial tasks
---

# Project Kickoff Workflow

Run when starting a new project to set it up fully in the PA system.

## Steps

1. **Gather Project Info**
   Ask Arnold for:
   - Project name
   - One-line description
   - Key stakeholders / clients involved
   - Primary goal / success metric
   - Deadline or target completion date
   - Current status (idea / in progress / just started)

2. **Identify Key People**
   - For each stakeholder mentioned, check if they're in `context/people.md`
   - If not, prompt Arnold: "Want to add a note on [Name]?" and add if yes

3. **Create Project Entry**
   Add the following entry to `context/projects.md`:

   ```
   ## [Project Name]
   **Status:** [Active / On Hold / Planning]
   **Goal:** [One-line goal]
   **Deadline:** [Date or TBD]
   **Stakeholders:** [Names]
   **Next Action:** [Immediate next step]
   **Notes:** [Any context]
   ```

4. **Capture Initial Tasks**
   - Ask: "What are the first 3 things that need to happen for this project?"
   - Run `skills/task_capture/SKILL.md` to process and route them

5. **Link to Goals**
   - Read `context/goals.md`
   - Ask: "Which of your current goals does this project support?"
   - Note the goal link in the project entry

6. **Set a Check-in**
   - Ask: "How often should I surface this in your daily briefing?"
   - Note frequency in the project entry

## Completion

Report: "Project '[Name]' is set up. First next action: [X]. I'll surface this in your [daily/weekly] briefing."
