#!/usr/bin/env node

/**
 * post_to_buffer.js
 * Queue a message to Buffer for a specific social channel.
 *
 * Usage:
 *   node post_to_buffer.js <channel> "Your message here" [--image <url_or_path>]
 *
 * Channels: twitter, linkedin, instagram
 *
 * Examples:
 *   node post_to_buffer.js twitter "Hello world!"
 *   node post_to_buffer.js linkedin "New blog post is live."
 *   node post_to_buffer.js twitter "Check this out!" --image https://example.com/photo.jpg
 *   node post_to_buffer.js twitter "My photo!" --image /path/to/local/image.jpg
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const ORGANIZATION_ID = "63c7bff362dba25c95e4caad";
const CHANNELS = {
  twitter: "6796e4ffa31978b79c7a0a9c",
  instagram: "692f958729ea336fd6488c5e",
  linkedin: "69a5491e3f3b94a12108da2c",
};

function parseChannels(input) {
  if (input === "all") return Object.keys(CHANNELS);
  return input.split(",").map((c) => c.trim().toLowerCase());
}

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) process.env[match[1]] = match[2];
    });
}

function fail(msg) {
  console.error("Error:", msg);
  process.exit(1);
}

function gqlRequest(queryObj) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(queryObj);
    const req = https.request(
      {
        hostname: "api.buffer.com",
        path: "/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BUFFER_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON: ${data}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function parseArgs(argv) {
  const args = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--image" && i + 1 < argv.length) {
      flags.image = argv[i + 1];
      i++;
    } else {
      args.push(argv[i]);
    }
  }
  return { args, flags };
}

function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      reject(new Error("Cloudinary credentials missing in .env"));
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const boundary = "----CloudinaryUpload" + Date.now();
    const fileData = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const parts = [
      `--${boundary}\r\n`,
      `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`,
      `Content-Type: application/octet-stream\r\n\r\n`,
    ];

    const fields = [
      `\r\n--${boundary}\r\n`,
      `Content-Disposition: form-data; name="api_key"\r\n\r\n${apiKey}`,
      `\r\n--${boundary}\r\n`,
      `Content-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}`,
      `\r\n--${boundary}\r\n`,
      `Content-Disposition: form-data; name="signature"\r\n\r\n${signature}`,
      `\r\n--${boundary}--\r\n`,
    ];

    const header = Buffer.from(parts.join(""));
    const footer = Buffer.from(fields.join(""));
    const body = Buffer.concat([header, fileData, footer]);

    const req = https.request(
      {
        hostname: "api.cloudinary.com",
        path: `/v1_1/${cloudName}/image/upload`,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            if (result.error) {
              reject(new Error(result.error.message));
            } else {
              resolve(result.secure_url);
            }
          } catch (e) {
            reject(new Error(`Invalid JSON: ${data}`));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function resolveImageUrl(imageInput) {
  if (!imageInput) return null;

  // If it's a URL (starts with http), use directly
  if (imageInput.match(/^https?:\/\//)) {
    return imageInput;
  }

  // If it's a local file path, upload to Cloudinary
  if (fs.existsSync(imageInput)) {
    console.log(`☁️  Uploading to Cloudinary: ${imageInput}`);
    const url = await uploadToCloudinary(imageInput);
    console.log(`☁️  Uploaded: ${url}\n`);
    return url;
  }

  throw new Error(`Image not found: ${imageInput}`);
}

async function createPost(channelId, text, imageUrl) {
  const input = {
    channelId: channelId,
    text: text,
    schedulingType: "automatic",
    mode: "addToQueue",
  };

  if (imageUrl) {
    input.assets = {
      images: [{ url: imageUrl }],
    };
  }

  const result = await gqlRequest({
    query: `mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess { post { id text status channel { name service } } }
        ... on NotFoundError { message }
        ... on UnauthorizedError { message }
        ... on UnexpectedError { message }
        ... on RestProxyError { message }
        ... on LimitReachedError { message }
        ... on InvalidInputError { message }
      }
    }`,
    variables: { input },
  });

  if (result.errors) {
    throw new Error(result.errors.map((e) => e.message).join(" | "));
  }
  const payload = result.data.createPost;
  if (payload.message) throw new Error(payload.message);
  return payload.post;
}

function fixText(text) {
  let fixed = text;

  // Common typos - each must be a complete word (with word boundaries)
  const typos = [
    // Word replacements with word boundaries
    { pattern: /\bteh\b/g, replacement: "the" },
    { pattern: /\bTeh\b/g, replacement: "The" },
    { pattern: /\badn\b/g, replacement: "and" },
    { pattern: /\bAdn\b/g, replacement: "And" },
    { pattern: /\btaht\b/g, replacement: "that" },
    { pattern: /\bTaht\b/g, replacement: "That" },
    { pattern: /\bwiht\b/g, replacement: "with" },
    { pattern: /\bWiht\b/g, replacement: "With" },
    { pattern: /\bfro\b/g, replacement: "for" },
    { pattern: /\bFro\b/g, replacement: "For" },
    { pattern: /\bgoot\b/g, replacement: "good" },
    { pattern: /\bGoot\b/g, replacement: "Good" },
    { pattern: /\bsi\b/g, replacement: "is" },
    { pattern: /\bSi\b/g, replacement: "Is" },
    { pattern: /\bti\b/g, replacement: "it" },
    { pattern: /\bTi\b/g, replacement: "It" },
    { pattern: /\byuo\b/g, replacement: "you" },
    { pattern: /\bYuo\b/g, replacement: "You" },
    { pattern: /\bthier\b/g, replacement: "their" },
    { pattern: /\bThier\b/g, replacement: "Their" },
    { pattern: /\brecieve\b/g, replacement: "receive" },
    { pattern: /\bRecieve\b/g, replacement: "Receive" },
    { pattern: /\bseperate\b/g, replacement: "separate" },
    { pattern: /\bSeperate\b/g, replacement: "Separate" },
    { pattern: /\boccured\b/g, replacement: "occurred" },
    { pattern: /\bOccured\b/g, replacement: "Occurred" },
    { pattern: /\bdefinately\b/g, replacement: "definitely" },
    { pattern: /\bDefinately\b/g, replacement: "Definitely" },
    { pattern: /\baccomodate\b/g, replacement: "accommodate" },
    { pattern: /\bAccomodate\b/g, replacement: "Accommodate" },
    // Contractions
    { pattern: /\bdont\b/g, replacement: "don't" },
    { pattern: /\bDont\b/g, replacement: "Don't" },
    { pattern: /\bwont\b/g, replacement: "won't" },
    { pattern: /\bWont\b/g, replacement: "Won't" },
    { pattern: /\bcant\b/g, replacement: "can't" },
    { pattern: /\bCant\b/g, replacement: "Can't" },
    { pattern: /\bim\b/g, replacement: "I'm" },
    { pattern: /\bIm\b/g, replacement: "I'm" },
    { pattern: /\bive\b/g, replacement: "I've" },
    { pattern: /\bIve\b/g, replacement: "I've" },
  ];

  for (const typo of typos) {
    fixed = fixed.replace(typo.pattern, typo.replacement);
  }

  // Capitalize standalone "i" to "I" (but not inside words)
  fixed = fixed.replace(/\bi\b/g, "I");

  // Capitalize first letter
  fixed = fixed.replace(/^[a-z]/, (char) => char.toUpperCase());

  // Capitalize first letter after sentence endings
  fixed = fixed.replace(/([.!?]\s+)([a-z])/g, (_, punct, char) => punct + char.toUpperCase());

  // Ensure ending punctuation if missing
  if (!/[.!?]$/.test(fixed.trim())) {
    fixed = fixed.trim() + ".";
  }

  // Fix double spaces (but preserve newlines)
  fixed = fixed.replace(/ {2,}/g, " ");

  return fixed;
}

function main() {
  loadEnv();
  const token = process.env.BUFFER_API_KEY;
  if (!token) fail("BUFFER_API_KEY not found in .env");

  const { args, flags } = parseArgs(process.argv.slice(2));
  if (args.length < 2) {
    fail(
      'Usage: node post_to_buffer.js <channel> "Your message" [--image <url_or_path>]\nChannels: ' +
        Object.keys(CHANNELS).join(", ") +
        "\nUse commas for multiple: twitter,linkedin\nUse 'all' for all channels."
    );
  }

  const channelInput = args[0].toLowerCase();
  const rawText = args.slice(1).join(" ");
  const channelNames = parseChannels(channelInput);

  const invalid = channelNames.filter((name) => !CHANNELS[name]);
  if (invalid.length > 0) {
    fail(
      `Unknown channel(s): ${invalid.join(", ")}. Available: ` +
        Object.keys(CHANNELS).join(", ")
    );
  }

  // Spell check and fix
  const text = fixText(rawText);
  if (text !== rawText) {
    console.log("\n📝 Text Review:");
    console.log("   Original:");
    console.log(rawText.split('\n').map(l => "     " + l).join('\n'));
    console.log("\n   Corrected:");
    console.log(text.split('\n').map(l => "     " + l).join('\n'));
    console.log("");
  }

  resolveImageUrl(flags.image)
    .then((imageUrl) => {
      if (imageUrl) {
        console.log(`📎 Attaching image: ${imageUrl}\n`);
      }

      const promises = channelNames.map((name) =>
        createPost(CHANNELS[name], text, imageUrl).then((post) => ({
          name,
          success: true,
          post,
        })).catch((err) => ({
          name,
          success: false,
          error: err.message,
        }))
      );

      return Promise.all(promises);
    })
    .then((results) => {
      console.log("\n📤 Buffer Post Results\n");
      results.forEach((r) => {
        if (r.success) {
          console.log(`✅ ${r.name}: ${r.post.channel.service} (${r.post.channel.name})`);
          console.log(`   Post ID: ${r.post.id}`);
          console.log(`   Status:  ${r.post.status}`);
        } else {
          console.log(`❌ ${r.name}: ${r.error}`);
        }
      });
    })
    .catch((err) => {
      fail(err.message);
    });
}

main();
