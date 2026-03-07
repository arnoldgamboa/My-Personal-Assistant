# 🤖 Arnold's AI Personal Assistant

A personal AI executive assistant built on Antigravity — designed to help manage work, knowledge, life, and growth through a structured system of skills, sub-agents, workflows, and persistent memory.

## Getting Started

The **brain** of this system is [`AGENTS.md`](./AGENTS.md). Every AI agent working in this project must read it first.

## Structure

| Folder | Purpose |
|--------|---------|
| `agents/` | Specialized sub-agent definitions |
| `skills/` | Reusable skill modules (SKILL.md format) |
| `workflows/` | Step-by-step repeatable workflows |
| `context/` | Long-term project, people, and goal context |
| `memory/` | Persistent memory, decisions, and logs |
| `inbox/` | Staging area for captured items |
| `resources/` | Templates and reference documents |

## Four Phases

1. **Setup** — Folders, AGENTS.md, and project structure ✅
2. **Context & Rules** — Fill in `context/` and refine `AGENTS.md`
3. **Skills & Sub-Agents** — Build out skill modules and specialized agents
4. **Growth** — Layer in more skills, memory, and context as needs evolve

## Usage

Simply open this project in your Antigravity workspace and start working. The assistant will:
- Read your context files to stay informed about your projects and goals
- Use skill files for recurring tasks
- Follow workflow files for structured processes
- Log important information to memory

## Contributing (to yourself)

Whenever you find yourself repeating a task or prompt, capture it as a new `skill/` or `workflow/` entry. The system grows with your usage.
