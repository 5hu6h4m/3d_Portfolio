const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = 'D:\\Portfolio';
const githubToken = process.argv[2] || process.env.GITHUB_TOKEN;

if (!githubToken || githubToken === 'github_pat_antigravitydummytoken') {
  console.error("ERROR: No valid GitHub Personal Access Token (PAT) provided! Please pass your PAT as an argument: node git-push.js github_pat_...");
  process.exit(1);
}

async function getFiles(dirPath, baseDir = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const relPath = path.join(baseDir, entry.name);
    // Ignore patterns
    if (
      entry.name === '.git' ||
      entry.name === 'node_modules' ||
      entry.name === '.next' ||
      entry.name === '.tempmediaStorage' ||
      entry.name === 'git-push.js' ||
      entry.name === 'package-lock.json'
    ) {
      continue;
    }
    if (entry.isDirectory()) {
      files = files.concat(await getFiles(path.join(dirPath, entry.name), relPath));
    } else {
      files.push(relPath.replace(/\\/g, '/'));
    }
  }
  return files;
}

async function main() {
  try {
    // 1. Init repo
    console.log("Initializing git repository...");
    await git.init({ fs, dir });

    // 2. Add remote origin
    console.log("Adding remote origin...");
    try {
      await git.addRemote({ fs, dir, remote: 'origin', url: 'https://github.com/5hu6h4m/3d_Portfolio.git' });
    } catch (e) {
      console.log("Remote origin already exists, proceeding.");
    }

    // 3. Scan and add files
    console.log("Scanning and adding files...");
    const files = await getFiles(dir);
    for (const file of files) {
      await git.add({ fs, dir, filepath: file });
    }
    console.log(`Added ${files.length} files to git.`);

    // 4. Commit
    console.log("Creating commit...");
    const sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'Roshan Bhagat',
        email: 'shubhambhagatsb@gmail.com'
      },
      message: 'Naruto Cinematic Portfolio Next.js Build'
    });
    console.log(`Commit created successfully with SHA: ${sha}`);

    // 4b. Rename branch to main
    console.log("Renaming branch to main...");
    try {
      await git.branch({ fs, dir, ref: 'main', checkout: true });
    } catch (e) {
      console.log('Branch rename note:', e.message);
    }

    // 5. Push
    console.log("Pushing to GitHub remote...");
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      force: true, // Force push to overwrite the initial skeleton repo
      onAuth: () => ({
        username: '5hu6h4m',
        password: githubToken
      })
    });
    
    console.log("Push result:", pushResult);
    console.log("SUCCESS: Code successfully pushed to GitHub repository!");
  } catch (error) {
    console.error("FATAL ERROR during git operation:", error);
    process.exit(1);
  }
}

main();
