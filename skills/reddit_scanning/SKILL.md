---
name: Reddit Scanning
description: Scans 10 target subreddits for high-value posts and provides summaries with potential engagement opportunities based on Arnold's persona.
---

# Reddit Scanning Skill

Fetches the latest posts from targeted entrepreneur/maker subreddits, filters them for relevance based on Arnold's background, and presents a curated list of engagement opportunities.

## When to Use

- Arnold says "scan Reddit", "find me posts to reply to", or "what's happening on Reddit today"
- Part of a daily or weekly routine to build karma and community presence

## Target Subreddits
r/agency, r/digitalmarketing, r/entrepreneur, r/indiehackers, r/localfirst, r/opensource, r/saas, r/selfhosted, r/sideproject, r/startups

## Inputs

None required from the user, but this skill relies on:
- Output from running `node scripts/fetch_reddit.js`
- `context/reddit_persona.md`
- `agents/reddit_scanner_agent.md`

## Steps

1. **CRITICAL — Save output to file first:** Run the fetch script and redirect to a file so the full output is never truncated:
   ```
   node scripts/fetch_reddit.js > /tmp/reddit_scan.txt 2>&1
   ```
2. Read the full contents of `/tmp/reddit_scan.txt` using the `view_file` tool. If the file is long (>800 lines), paginate through it to ensure all posts are reviewed.
3. Read `context/reddit_persona.md` to ground your filtering criteria in Arnold's experience (25 years agency, building SaaS, peer-to-peer approach).
4. Select the top 5 most relevant posts where Arnold can offer genuine value, share a struggle, or provide seasoned perspective. YOU MUST PROVIDE AT LEAST 5 POSTS.
5. **CRITICAL — URLs must be real:** For every post you include, the URL in the output MUST be copied exactly from the `URL:` line in `/tmp/reddit_scan.txt`. **Never invent, guess, or approximate a Reddit URL.** If a post's URL was not in the script output, do not include that post.
6. For each selected post, provide:
   - The Subreddit and Post Title with a clickable link (exact URL from scan output).
   - A short (1-2 sentence) summary of the post's core question or struggle.
   - A brief note on *why* this is relevant to Arnold.
   - A 2-3 sentence draft reply using the `Reddit Engagement` skill guidelines.

## Output Format

```markdown
## 🔎 Reddit Engagement Opportunities
*Scanned 10 subreddits. Here are the best places to drop some value today:*

### [r/SaaS] [User is struggling with churn after 3 months](https://reddit.com/r/SaaS/comments/...)
**Summary:** The poster built a tool for local businesses but is seeing 40% churn after the initial onboarding phase.
**Why it fits:** Perfect for Arnold's lived experience with the hard realities of business pressure and "vitamin vs painkiller" solutions.
**Suggested Angle/Draft:** "Local businesses churn quickly if it doesn't solve an immediate, bleeding-neck pain. Are you selling a vitamin or a painkiller? Need to focus heavily on the onboarding."

*(Repeat for all 5 posts)*
```
