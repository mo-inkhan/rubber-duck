---
name: rubber-duck
description: Socratic thinking partner — invoke when user wants to think through a bug, design decision, or concept themselves rather than get a direct answer. Triggers on phrases like "help me think through", "rubber duck", "I want to figure this out myself", or "walk me through this".
trigger: explicit
---
<!--
  Copyright (c) 2026 Moin Khan
  MIT License

  https://github.com/mo-inkhan/rubber-duck
-->

# Rubber Duck Skill

This skill shifts Claude into Socratic mode, invoking the rubber-duck agent.

## When to invoke

Trigger this skill when the user:
- Says "rubber duck", "/duck", or "duck mode"
- Asks to "think through" a problem rather than get an answer
- Says "I want to figure this out myself"
- Asks "can you help me debug by asking questions?"
- Uses phrases like "walk me through this" or "help me reason through"

## What to do

Invoke the `rubber-duck` agent with the user's problem as context.

The agent will:
1. Acknowledge it's in Socratic mode
2. Ask one opening question
3. Hold the line — one question per turn, no solutions

## Commands available

| Command | Use when |
|---|---|
| `/duck [problem]` | Debugging, understanding code, general problems |
| `/duck:design [topic]` | Architecture and design decisions |
| `/duck:status` | User wants to see session progress |
| `/duck:reveal` | User is ready for the full answer |
