---
description: Show a summary of past Rubber Duck sessions — streaks, peek history, and recent activity.
allowed-tools: Bash
---
<!--
  Copyright (c) 2026 Moin Khan
  MIT License

  https://github.com/mo-inkhan/rubber-duck
-->

# Duck Sessions

Read `~/.rubber-duck/stats.json` and the most recent files in `~/.rubber-duck/sessions/` and present a clean summary.

Show:

1. **Overall stats** — total sessions, solved without peeking, current streak
2. **Recent sessions** — last 10 sessions as a simple table: date, duration, peeked (yes/no)
3. **Streak calendar** — a visual row of dots for the last 30 sessions (🟡 = no peek, ⬜ = peeked)

If `~/.rubber-duck/` does not exist or is empty, tell the user they haven't completed a session yet and that stats are recorded automatically at the end of each duck session.

Keep the output concise and scannable. No padding, no filler.
