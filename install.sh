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
echo "🦆 Installing rubber-duck..."
echo ""

# --- Commands ---
mkdir -p "${CLAUDE_DIR}/commands"
for cmd in "${PLUGIN_DIR}/commands/"*.md; do
  name="$(basename "$cmd")"
  cp "$cmd" "${CLAUDE_DIR}/commands/${name}"
  check "commands/${name}"
done
mkdir -p "${CLAUDE_DIR}/commands/duck"
for cmd in "${PLUGIN_DIR}/commands/duck/"*.md; do
  name="$(basename "$cmd")"
  cp "$cmd" "${CLAUDE_DIR}/commands/duck/${name}"
  check "commands/duck/${name}"
done

# --- Agent ---
mkdir -p "${CLAUDE_DIR}/agents"
cp "${PLUGIN_DIR}/agents/rubber-duck.md" "${CLAUDE_DIR}/agents/rubber-duck.md"
check "agents/rubber-duck.md"

# --- Skill ---
mkdir -p "${CLAUDE_DIR}/skills/rubber-duck"
cp "${PLUGIN_DIR}/skills/rubber-duck/SKILL.md" "${CLAUDE_DIR}/skills/rubber-duck/SKILL.md"
check "skills/rubber-duck/SKILL.md"

# --- Hook: register SessionEnd in ~/.claude/settings.json ---
SETTINGS_FILE="${CLAUDE_DIR}/settings.json"
HOOK_CMD="node ${PLUGIN_DIR}/hooks/session-logger.js"

if [ ! -f "${SETTINGS_FILE}" ]; then
  echo "{}" > "${SETTINGS_FILE}"
fi

node - "${SETTINGS_FILE}" "${HOOK_CMD}" <<'EOF'
const fs = require('fs');
const [,, settingsFile, hookCmd] = process.argv;

let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8')); } catch {}

if (!settings.hooks) settings.hooks = {};
if (!settings.hooks.SessionEnd) settings.hooks.SessionEnd = [];

const alreadyInstalled = settings.hooks.SessionEnd.some(
  entry => Array.isArray(entry.hooks) && entry.hooks.some(h => h.command === hookCmd)
);

if (!alreadyInstalled) {
  settings.hooks.SessionEnd.push({
    hooks: [{ type: "command", command: hookCmd }]
  });
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  console.log('  \x1b[32m✓\x1b[0m hooks/session-logger.js registered');
} else {
  console.log('  \x1b[90m✓ hook already registered\x1b[0m');
}
EOF

echo ""
echo "🦆 Done. Try \`/duck\` in your next Claude Code session."
echo ""
info "Session logs: ~/.rubber-duck/sessions/"
info "Stats:        ~/.rubber-duck/stats.json"
info "To uninstall: remove the copied files from ~/.claude/ and the hook from ~/.claude/settings.json"
echo ""
