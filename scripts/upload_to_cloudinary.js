#!/usr/bin/env node

/**
 * upload_to_cloudinary.js
 * Upload a local image file to Cloudinary and return the public URL.
 *
 * Usage:
 *   node upload_to_cloudinary.js <path/to/image.jpg>
 *
 * Returns:
 *   https://res.cloudinary.com/.../image.jpg
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");

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

function generateSignature(timestamp, apiSecret) {
  const str = `timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash("sha1").update(str).digest("hex");
}

function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      reject(new Error("Cloudinary credentials missing in .env"));
      return;
    }

    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp, apiSecret);

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

function main() {
  loadEnv();

  const filePath = process.argv[2];
  if (!filePath) {
    fail("Usage: node upload_to_cloudinary.js <path/to/image>");
  }

  uploadImage(filePath)
    .then((url) => {
      console.log(url);
    })
    .catch((err) => {
      fail(err.message);
    });
}

main();
