---
name: duck:status
description: Show a structured summary of the current rubber-duck session — what you've figured out, what's still open, and where you are.
trigger: explicit
allowed-tools: Read, Grep, Glob, LS
---
<!--
  Copyright (c) 2026 Moin Khan
  MIT License

  https://github.com/mo-inkhan/rubber-duck
-->

# Duck Session Status

The user wants a snapshot of where they are in this rubber-duck session.

Review the conversation so far and produce a structured summary in this exact format:

---

## 🦆 Duck Session Summary

**Problem:** [One sentence — the original problem as the user stated it]

**What you've figured out:**
- [Each insight the user has reached themselves, in their words where possible]
- [Be specific — "the error is in the billing middleware" not "you made progress"]

**Still open:**
- [Unresolved questions or unknowns that remain]

**Where you are:**
[One sentence placing them in the arc — e.g. "You're one step from the root cause" or "You've narrowed it to two possibilities."]

---

Keep it tight. This is a mirror, not a lecture. No new questions here, no advice — just an honest reflection of what's happened.

After the summary, ask: "Want to keep going, or are you ready to call it?"
