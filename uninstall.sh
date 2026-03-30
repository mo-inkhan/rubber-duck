#!/usr/bin/env bash
# ==============================================
# Copyright (c) 2026 Moin Khan
# MIT License
#
# https://github.com/mo-inkhan/rubber-duck
# ==============================================
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${HOME}/.claude"

GREEN='\033[0;32m'
MUTED='\033[0;90m'
RESET='\033[0m'

check() { echo -e "  ${GREEN}✓${RESET} $1"; }
info()  { echo -e "  ${MUTED}$1${RESET}"; }

echo ""
echo "🦆 Uninstalling rubber-duck..."
echo ""

# --- Commands ---
rm -f "${CLAUDE_DIR}/commands/duck.md"
rm -rf "${CLAUDE_DIR}/commands/duck"
check "commands removed"

# --- Agent ---
rm -f "${CLAUDE_DIR}/agents/rubber-duck.md"
check "agents/rubber-duck.md removed"

# --- Skill ---
rm -rf "${CLAUDE_DIR}/skills/rubber-duck"
check "skills/rubber-duck removed"

# --- Hook: remove from ~/.claude/settings.json ---
SETTINGS_FILE="${CLAUDE_DIR}/settings.json"
HOOK_CMD="node ${PLUGIN_DIR}/hooks/session-logger.js"

if [ -f "${SETTINGS_FILE}" ]; then
  node - "${SETTINGS_FILE}" "${HOOK_CMD}" <<'EOF'
const fs = require('fs');
const [,, settingsFile, hookCmd] = process.argv;

let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8')); } catch { process.exit(0); }

if (!settings.hooks?.SessionEnd) process.exit(0);

const before = settings.hooks.SessionEnd.length;
settings.hooks.SessionEnd = settings.hooks.SessionEnd.filter(
  entry => !(Array.isArray(entry.hooks) && entry.hooks.some(h => h.command === hookCmd))
);

if (settings.hooks.SessionEnd.length < before) {
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  console.log('  \x1b[32m✓\x1b[0m hook unregistered from settings.json');
} else {
  console.log('  \x1b[90m✓ hook not found in settings.json (already removed)\x1b[0m');
}
EOF
fi

echo ""
echo "🦆 rubber-duck uninstalled."
echo ""
info "Session logs and stats are kept at ~/.rubber-duck/ — remove manually if you want a clean slate."
echo ""
