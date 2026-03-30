#!/usr/bin/env node
/**
 * Copyright (c) 2026 Moin Khan
 * MIT License
 *
 * https://github.com/mo-inkhan/rubber-duck
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PLUGIN_DIR = path.join(__dirname, '..');
const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const HOOK_CMD = `node ${path.join(PLUGIN_DIR, 'hooks', 'session-logger.js').replace(/\\/g, '/')}`;

const GREEN = '\x1b[32m';
const MUTED = '\x1b[90m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

const check = (msg) => console.log(`  ${GREEN}✓${RESET} ${msg}`);
const info  = (msg) => console.log(`  ${MUTED}${msg}${RESET}`);
const err   = (msg) => console.log(`  ${RED}✗${RESET} ${msg}`);

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function install() {
  console.log('\n🦆 Installing rubber-duck...\n');

  // Commands
  copyFile(
    path.join(PLUGIN_DIR, 'commands', 'duck.md'),
    path.join(CLAUDE_DIR, 'commands', 'duck.md')
  );
  check('commands/duck.md');

  for (const name of ['design.md', 'status.md', 'reveal.md', 'sessions.md']) {
    copyFile(
      path.join(PLUGIN_DIR, 'commands', 'duck', name),
      path.join(CLAUDE_DIR, 'commands', 'duck', name)
    );
    check(`commands/duck/${name}`);
  }

  // Agent
  copyFile(
    path.join(PLUGIN_DIR, 'agents', 'rubber-duck.md'),
    path.join(CLAUDE_DIR, 'agents', 'rubber-duck.md')
  );
  check('agents/rubber-duck.md');

  // Skill
  copyFile(
    path.join(PLUGIN_DIR, 'skills', 'rubber-duck', 'SKILL.md'),
    path.join(CLAUDE_DIR, 'skills', 'rubber-duck', 'SKILL.md')
  );
  check('skills/rubber-duck/SKILL.md');

  // Hook
  const settingsFile = path.join(CLAUDE_DIR, 'settings.json');
  let settings = {};
  try { settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8')); } catch {}

  if (!settings.hooks) settings.hooks = {};
  if (!settings.hooks.SessionEnd) settings.hooks.SessionEnd = [];

  const alreadyInstalled = settings.hooks.SessionEnd.some(
    entry => Array.isArray(entry.hooks) && entry.hooks.some(h => h.command === HOOK_CMD)
  );

  if (!alreadyInstalled) {
    settings.hooks.SessionEnd.push({ hooks: [{ type: 'command', command: HOOK_CMD }] });
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    check('hooks/session-logger.js registered');
  } else {
    info('hook already registered');
  }

  console.log('\n🦆 Done. Try `/duck` in your next Claude Code session.\n');
  info('Session logs: ~/.rubber-duck/sessions/');
  info('Stats:        ~/.rubber-duck/stats.json');
  info('To uninstall: npx @mo-inkhan/rubber-duck uninstall');
  console.log();
}

function uninstall() {
  console.log('\n🦆 Uninstalling rubber-duck...\n');

  const toRemove = [
    path.join(CLAUDE_DIR, 'commands', 'duck.md'),
    path.join(CLAUDE_DIR, 'agents', 'rubber-duck.md'),
  ];

  for (const f of toRemove) {
    try { fs.rmSync(f); } catch {}
  }

  const toDirs = [
    path.join(CLAUDE_DIR, 'commands', 'duck'),
    path.join(CLAUDE_DIR, 'skills', 'rubber-duck'),
  ];

  for (const d of toDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch {}
  }

  check('plugin files removed');

  // Remove hook
  const settingsFile = path.join(CLAUDE_DIR, 'settings.json');
  let settings = {};
  try { settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8')); } catch { process.exit(0); }

  if (settings.hooks?.SessionEnd) {
    const before = settings.hooks.SessionEnd.length;
    settings.hooks.SessionEnd = settings.hooks.SessionEnd.filter(
      entry => !(Array.isArray(entry.hooks) && entry.hooks.some(h => h.command === HOOK_CMD))
    );
    if (settings.hooks.SessionEnd.length < before) {
      fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
      check('hook unregistered from settings.json');
    }
  }

  console.log('\n🦆 rubber-duck uninstalled.\n');
  info('Session logs kept at ~/.rubber-duck/ — remove manually for a clean slate.');
  console.log();
}

const cmd = process.argv[2];
if (cmd === 'uninstall') {
  uninstall();
} else {
  install();
}
