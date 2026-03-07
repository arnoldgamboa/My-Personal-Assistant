---
name: blog_writing
description: Drafts blog posts for "Shipped & Unfinished" adhering strictly to the builder's journal persona.
---

# Skill: Blog Writing

## Purpose
This skill is used to draft, edit, and ideate blog posts for Arnold's blog, "Shipped & Unfinished".

## Dependencies
- `context/blog_writer_persona.md` (Mandatory: Controls tone, voice, structure, and format rules)
- `context/projects.md` (For grounding posts in real work and projects)

## Execution Steps

1. **Understand the Source Material:** Read the provided context, notes, or code that the blog post will be based on.
2. **Read the Persona Document:** Review `context/blog_writer_persona.md` carefully. The blog post MUST follow the specified constraints (e.g., Short paragraphs, direct tone, specific structure, signature closer).
3. **Draft the Post:** 
   - Follow the structure: Situation -> Problem -> Attempted Solutions -> Outcome -> Unfinished Closer.
   - Use the first person ("I").
   - Ensure the tone is direct, opinionated, and grounded in real work (no fluff, no academic hedging).
4. **Review against Constraints:** 
   - Is it between 600-1,200 words? (If it's naturally shorter and complete, that's fine, don't pad it).
   - Are paragraphs 2-4 sentences max?
   - Is the signature closer present?
5. **Output the Draft:** Provide the draft in markdown format.
