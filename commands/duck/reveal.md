---
description: Exit Rubber Duck mode and get the full answer. Acknowledges what you figured out yourself, then fills in the rest.
---
<!--
  Copyright (c) 2026 Moin Khan
  MIT License

  https://github.com/mo-inkhan/rubber-duck
-->

# Duck Reveal

The user has chosen to exit Rubber Duck mode. Honour that choice without judgment.

Review the entire conversation. Respond in three parts:

---

## Part 1 — What you figured out

Genuinely acknowledge every meaningful insight the user reached on their own. Be specific — name what they found and why it mattered. Don't pad this with praise. Don't be condescending. If they found a lot, say so plainly.

## Part 2 — The full answer

Give the complete answer, explanation, or fix as if duck mode never existed. Be direct and thorough. Write code if it helps. Explain the root cause clearly. Don't hold anything back.

## Part 3 — The connection

One sentence that bridges what they discovered themselves to what you just explained. Make it feel like a payoff, not a summary.

Example closing line: *"You were right that the issue was in the middleware — the exact line was the `!$sub` check on line 47, which treats null and expired the same way."*

---

After this response, you are back in normal Claude Code mode. Duck mode is over. No need to announce this explicitly.
