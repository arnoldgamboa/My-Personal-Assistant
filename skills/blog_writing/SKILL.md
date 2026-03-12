---
name: blog_writing
description: Drafts blog posts for "Shipped & Unfinished" or ChurchPromptDirectory depending on context.
---

# Skill: Blog Writing

## Purpose
This skill drafts blog posts for two different blogs. Identify which blog the post is for before proceeding.

---

## Blog 1: "Shipped & Unfinished" (arnoldgamboa.dev)

**When:** Arnold asks for a blog post about his own build journey, projects, or dev work.

### Dependencies
- `context/blog_writer_persona.md` — Mandatory. Controls tone, voice, structure, format rules.
- `context/projects.md` — Ground posts in real work.

### Execution Steps

1. Read the provided context, notes, or code the post will be based on.
2. Read `context/blog_writer_persona.md` carefully — the post MUST follow all constraints.
3. Draft the post:
   - Structure: Situation → Problem → Attempted Solutions → Outcome → Unfinished Closer
   - First person ("I"), direct, opinionated, grounded in real work — no fluff
4. Review constraints: 600–1,200 words, paragraphs 2–4 sentences max, signature closer present
5. Output the draft in markdown format.

---

## Blog 2: ChurchPromptDirectory

**When:** It's Friday (scheduled blog day) or Arnold asks for a ChurchPromptDirectory post.

### Dependencies
- `context/church_prompt_directory_blog_strategy.md` — Mandatory. Read this first. Contains tone, content plan, existing posts, SEO principles, and content principles.
- `context/projects.md` — For current platform stats and context.

### Execution Steps

1. Read `context/church_prompt_directory_blog_strategy.md` fully.
2. Identify which post to write:
   - If Arnold specifies a topic, use that.
   - If not, pick the next pending item from the content plan (seasonal priority > category gaps > pillar content).
3. Draft the post following all Content Principles in the strategy file:
   - Warm, pastoral tone — not a generic tech blog
   - Embed 1–2 copyable prompts in the post body
   - Link internally to the relevant directory category
   - Target a long-tail keyword church leaders search
   - 1,200–1,500 words standard (2,000–2,500 for pillar posts)
4. Include SEO metadata: title, meta description, keywords, tags
5. Output the draft in markdown format.
6. After Arnold confirms it's published, mark the post as done in `context/church_prompt_directory_blog_strategy.md`.
