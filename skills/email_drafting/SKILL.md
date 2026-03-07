---
name: Email Drafting
description: Drafts professional, context-aware emails or replies on Arnold's behalf, matching his voice and communication preferences.
---

# Email Drafting Skill

Drafts emails and replies that sound like Arnold — concise, professional, and direct.

## When to Use

- Arnold says "draft an email to...", "help me reply to...", or "write a message to..."
- When composing outreach, follow-ups, or client communications

## Inputs

Before drafting, gather the following:

**Required:**
- **Recipient** — Name and role/relationship
- **Purpose** — What the email needs to accomplish
- **Tone** — Formal / semi-formal / casual (default: semi-formal)

**Optional (read from context if not provided):**
- `context/people.md` — Relationship notes on the recipient
- `context/projects.md` — Relevant project context
- Previous email thread or conversation history if provided

## Arnold's Voice

Match these characteristics in all drafts:
- **Direct** — Lead with the point, no pleasantries until after the key ask
- **Concise** — Short paragraphs, no filler phrases ("I hope this finds you well", "As you know")
- **Warm but professional** — Friendly without being informal
- **Action-clear** — Every email should have one clear next step or CTA

## Output Format

```
**Subject:** [Clear, specific subject line]

---

[Email body]

[Signature if needed: Arnold Gamboa]
```

Offer 2–3 subject line options when the context warrants it.

## Steps

1. Confirm recipient, purpose, and tone (ask if missing)
2. Read `context/people.md` for relationship note on the recipient
3. Read relevant project context if the email is project-related
4. Draft the email body following Arnold's voice guidelines
5. Add a clear subject line
6. Present the draft and ask: "Want me to adjust the tone, length, or any specific section?"

## Notes

- Never send emails autonomously. Always present the draft for Arnold's review.
- If the recipient is in `context/people.md`, reference relationship notes for appropriate tone calibration
- For sensitive emails (complaints, negotiations, terminations), flag with `⚠️ Sensitive email` and offer multiple tone variants
