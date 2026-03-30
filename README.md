<!--
  Copyright (c) 2026 Moin Khan
  MIT License

  https://github.com/mo-inkhan/rubber-duck
-->

# 🦆 rubber-duck

> *A Claude Code plugin that helps you think - not by giving answers, but by asking the right questions.*

Most AI tools race to give you the answer. `rubber-duck` does something different: it slows down, asks one question at a time, and helps you reason through the problem yourself.

This is the Socratic method, packaged as a Claude Code plugin.

---

## Why this exists

There's a well-known debugging technique where you explain your problem out loud to a rubber duck. Just the act of articulating it — slowly, carefully — often surfaces the answer before the duck says a word.

The problem: a rubber duck can't ask follow-up questions.

`rubber-duck` gives the duck a voice. When you're stuck, confused, or just want to understand something deeply instead of copy-pasting a fix, this plugin shifts Claude into a guided thinking partner that holds the line even when you beg for the answer.

**For developers who want to actually learn. For seniors mentoring juniors. For anyone building intuition, not just shipping code.**

---

## Install

```bash
git clone https://github.com/mo-inkhan/rubber-duck
cd rubber-duck/plugin
bash install.sh
```

> Marketplace and `npx` installation coming soon.

---

## Commands

| Command | What it does |
|---|---|
| `/duck [problem]` | Enter Rubber Duck mode. Describe your problem or just start talking. |
| `/duck:design [topic]` | Design mode — think through architecture and tradeoffs. |
| `/duck:status` | See a structured summary of what you've figured out so far. |
| `/duck:reveal` | Break glass. Exit Rubber Duck mode and get the full answer. |
| `/duck:sessions` | View past session history — streaks, peek log, and recent activity. |

---

## Usage

### Basic debugging session

```
> /duck My API returns a 500 but only when the user has a free plan

🦆 Okay, I'm in Rubber Duck mode — I'll ask questions instead of solving things for you.
   Use /duck:reveal whenever you want me to step out of this.

   Let's start here: what do you know about what's different between a free plan
   user and a paid plan user at the point this request hits your controller?
```

### Architecture thinking

```
> /duck:design I need to add real-time notifications to my Laravel app

🦆 Good problem to think through carefully. First question:
   When you say "real-time" — what's the actual tolerance here? Would
   a 2-second delay be acceptable, or does this need to feel instant?
```

### Checking progress

```
> /duck:status

## 🦆 Duck Session Summary

Problem: API returning 500 only for free plan users

What you've figured out:
- The error is in the billing middleware, not the controller
- Free plan users have a null subscription_id

Still open:
- Whether the middleware is checking for null or just falsy

You're currently: one step away from identifying the exact null check
```

### When you're truly stuck

```
> /duck:reveal

You got pretty far on your own — you correctly identified the billing
middleware and traced it to the subscription_id field. The key thing
you were one step from: the check on line 47 uses `!$sub` which treats
both null and an expired subscription the same way...
```

---

## Streak tracking

After every session, `rubber-duck` logs whether you used `/duck:reveal` and maintains a running streak of sessions where you solved the problem without peeking.

```
🦆✅  Rubber Duck session complete.
   You solved it without peeking!
   No-peek streak: 7 sessions 🔥
   All-time: 14/17 solved without peeking
```

Session logs are stored locally at `~/.rubber-duck/sessions/`.

---

## The philosophy

The rubber duck technique works because **articulation forces clarity**. When you have to explain something, you expose your own assumptions.

This plugin doesn't try to make Claude smarter. It tries to make *you* think harder — by making Claude ask better questions instead of giving faster answers.

The escape hatch (`/duck:reveal`) exists because sometimes you genuinely need the answer. But it's there when *you* choose it, not when Claude gives up on you.

---

## Contributing

PRs welcome. Especially interested in:

- New question toolkits for specific problem types (SQL debugging, regex, async/await confusion)
- A `/duck:learn` mode that teaches concepts after you've reasoned to them yourself
- Export session logs to markdown for personal knowledge bases

---

## Updating

**Via git:**
```bash
cd rubber-duck/plugin
git pull
bash install.sh
```

Re-running the installer is safe — it overwrites plugin files and skips hook registration if already present.

---

## License

MIT
