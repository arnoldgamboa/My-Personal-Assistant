#!/usr/bin/env node

const https = require('https');

const SUBREDDITS = [
    'agency', 'digitalmarketing', 'entrepreneur', 'indiehackers',
    'localfirst', 'opensource', 'saas', 'selfhosted', 'sideproject', 'startups'
];

const LIMIT = 5; // number of posts to fetch per subreddit

// Reddit requires a custom User-Agent to prevent 429 Too Many Requests
const USER_AGENT = 'script:Arnold_Personal_Assistant:v1.0.0 (by /u/Arnold_PA)';

async function fetchSubreddit(subreddit) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.reddit.com',
            path: `/r/${subreddit}/new.json?limit=${LIMIT}`,
            method: 'GET',
            headers: {
                'User-Agent': USER_AGENT
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            // Handle redirections
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                console.error(`Redirected from /r/${subreddit} to ${res.headers.location}`);
                // Simple redirect handling could go here, but normally /new.json doesn't redirect unless the name changed
                return resolve([]);
            }

            if (res.statusCode !== 200) {
                console.error(`Error fetching r/${subreddit}: Status Code ${res.statusCode}`);
                // Don't reject, just resolve empty to keep going with other subreddits
                return resolve([]);
            }

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (!parsed.data || !parsed.data.children) {
                        return resolve([]);
                    }
                    const posts = parsed.data.children.map(child => {
                        const post = child.data;
                        return {
                            subreddit: subreddit,
                            title: post.title,
                            url: `https://reddit.com${post.permalink}`,
                            text: post.selftext ? post.selftext.substring(0, 1000) : '[No Text / Link Post]', // truncate to 1k chars to save context
                            score: post.score,
                            author: post.author,
                            num_comments: post.num_comments
                        };
                    });
                    resolve(posts);
                } catch (e) {
                    console.error(`Error parsing JSON for r/${subreddit}:`, e.message);
                    resolve([]);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Network error on r/${subreddit}:`, e.message);
            resolve([]);
        });

        req.end();
    });
}

// Throttle requests slightly because Reddit API rate limits
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    console.log(`Starting Reddit scan for ${SUBREDDITS.length} subreddits...\n`);

    let allPosts = [];

    for (const sub of SUBREDDITS) {
        // console.error(`Fetching r/${sub}...`); // Output progress to stderr so we can pipe stdout purely for data
        const posts = await fetchSubreddit(sub);
        allPosts = allPosts.concat(posts);
        await delay(1000); // 1 fetch per second
    }

    // Output formatted list for Antigravity to parse easily
    console.log("=== REDDIT SCAN RESULTS ===\n");

    // Sort by subreddit
    allPosts.sort((a, b) => a.subreddit.localeCompare(b.subreddit));

    let currentSub = '';

    for (const post of allPosts) {
        if (post.subreddit !== currentSub) {
            currentSub = post.subreddit;
            console.log(`\n### Subreddit: r/${currentSub}`);
        }

        console.log(`\nTITLE: ${post.title}`);
        console.log(`URL: ${post.url}`);
        console.log(`AUTHOR: ${post.author} | SCORE: ${post.score} | COMMENTS: ${post.num_comments}`);
        console.log(`TEXT BEGIN:\n${post.text}\nTEXT END`);
        console.log(`-`.repeat(40));
    }
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
