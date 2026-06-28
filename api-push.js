/**
 * api-push.js — Push files to GitHub using REST Contents API
 * Works even when git HTTPS is blocked (fine-grained tokens with Contents write permission)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.argv[2];
const OWNER = '5hu6h4m';
const REPO = '3d_Portfolio';
const BRANCH = 'main';

if (!TOKEN) { console.error('Usage: node api-push.js <token>'); process.exit(1); }

function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path: urlPath,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'portfolio-push',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Get files to upload
function getFiles(dirPath, base = '') {
  const IGNORE = new Set(['.git', 'node_modules', '.next', 'git-push.js', 'api-push.js', 'package-lock.json', '.tempmediaStorage']);
  const IGNORE_EXT = new Set(['.webp', '.ico', '.png', '.svg']);
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    if (IGNORE.has(e.name)) continue;
    if (IGNORE_EXT.has(path.extname(e.name))) continue;
    // Skip metadata json files
    if (e.name.endsWith('.metadata.json')) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) files = files.concat(getFiles(path.join(dirPath, e.name), rel));
    else files.push(rel);
  }
  return files;
}

async function getExistingSha(filePath) {
  const res = await apiRequest('GET', `/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`);
  if (res.status === 200 && res.body.sha) return res.body.sha;
  return null;
}

async function pushFile(filePath) {
  const absPath = path.join('D:\\Portfolio', filePath.replace(/\//g, '\\'));
  const content = fs.readFileSync(absPath);
  const encoded = content.toString('base64');
  const sha = await getExistingSha(filePath);

  const body = {
    message: `feat: Naruto cinematic portfolio - ${filePath}`,
    content: encoded,
    branch: BRANCH,
    ...(sha ? { sha } : {})
  };

  const res = await apiRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${filePath}`, body);
  if (res.status === 200 || res.status === 201) {
    process.stdout.write(`✓ ${filePath}\n`);
    return true;
  } else {
    process.stdout.write(`✗ ${filePath} [${res.status}] ${JSON.stringify(res.body?.message || res.body)}\n`);
    return false;
  }
}

async function main() {
  console.log(`Pushing to github.com/${OWNER}/${REPO} (${BRANCH})...`);
  const files = getFiles('D:\\Portfolio');
  console.log(`Found ${files.length} files to push.\n`);

  let ok = 0, fail = 0;
  for (const f of files) {
    const success = await pushFile(f);
    if (success) ok++; else fail++;
    // Small delay to avoid rate limit
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDone! ${ok} pushed, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
