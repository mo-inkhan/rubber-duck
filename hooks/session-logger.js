#!/usr/bin/env node
/**
 * Copyright (c) 2026 Moin Khan
 * MIT License
 *
 * https://github.com/mo-inkhan/rubber-duck
 */

/**
 * rubber-duck: session-logger hook
 *
 * Fires on SessionEnd. Writes a structured session log to
 * ~/.rubber-duck/sessions/YYYY-MM-DD_HH-MM.json
 *
 * Tracks:
 * - Whether /duck:reveal was used ("peeked")
 * - Session duration
 * - A hash of the project path (for streak tracking without storing paths)
 */

import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const sessionData = JSON.parse(process.env.CLAUDE_HOOK_EVENT || "{}");

const logDir = path.join(os.homedir(), ".rubber-duck", "sessions");
fs.mkdirSync(logDir, { recursive: true });

const statsFile = path.join(os.homedir(), ".rubber-duck", "stats.json");

// Load or initialise stats
let stats = { totalSessions: 0, solvedWithoutPeeking: 0, streak: 0, lastSessionDate: null };
try {
  stats = JSON.parse(fs.readFileSync(statsFile, "utf8"));
} catch {}

const now = new Date();
const dateStr = now.toISOString().replace(/[:.]/g, "-").slice(0, 16);
const logFile = path.join(logDir, `${dateStr}.json`);

// Detect if /duck:reveal was used in this session
const transcript = sessionData?.transcript || [];
const peeked = transcript.some(
  (msg) =>
    msg?.role === "user" &&
    typeof msg?.content === "string" &&
    msg.content.includes("/duck:reveal")
);

const sessionLog = {
  timestamp: now.toISOString(),
  projectHash: crypto
    .createHash("sha256")
    .update(process.cwd())
    .digest("hex")
    .slice(0, 8),
  peeked,
  durationMinutes: Math.round((sessionData?.durationMs || 0) / 60000),
};

fs.writeFileSync(logFile, JSON.stringify(sessionLog, null, 2));

// Update streak stats
const today = now.toISOString().slice(0, 10);
stats.totalSessions++;
if (!peeked) stats.solvedWithoutPeeking++;

const yesterday = new Date(now - 86400000).toISOString().slice(0, 10);
if (peeked) {
  stats.streak = 0;
} else if (stats.lastSessionDate === today || stats.lastSessionDate === yesterday) {
  stats.streak = (stats.streak || 0) + 1;
} else {
  stats.streak = 1;
}
stats.lastSessionDate = today;

fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));

// Print summary to terminal
const duckEmoji = peeked ? "🦆💔" : "🦆✅";
const peekMsg = peeked
  ? "You used /duck:reveal this session."
  : "You solved it without peeking!";

console.log(`\n${duckEmoji}  Rubber Duck session complete.`);
console.log(`   ${peekMsg}`);
if (!peeked) {
  console.log(`   No-peek streak: ${stats.streak} session${stats.streak !== 1 ? "s" : ""} 🔥`);
}
console.log(
  `   All-time: ${stats.solvedWithoutPeeking}/${stats.totalSessions} solved without peeking`
);
console.log();
