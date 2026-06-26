# Claude Tmux Fork Plugin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken `PreToolUse`-based hook with a `UserPromptSubmit` hook that intercepts `/fork` and `/branch`, blocks them, and forks the session to a tmux side pane.

**Architecture:** A `UserPromptSubmit` hook fires on every user prompt. The `user-prompt` bash script checks if the prompt starts with `/fork` or `/branch`. If so, it blocks the original command and runs `tmux split-window -d "claude --resume <session_id> --fork-session"` to create a true fork in a side pane.

**Tech Stack:** Bash, jq, tmux, Claude Code hooks system

**Base directory:** `/Users/macbook/Project/tmux-session/claude/`

---

### Task 1: Create `user-prompt` hook script

**Files:**
- Create: `hooks/user-prompt`

- [ ] **Step 1: Write the user-prompt script**

```bash
#!/bin/bash
# UserPromptSubmit hook — intercept /fork and /branch, fork to tmux side pane
# Reads stdin JSON, checks prompt, blocks /fork and /branch, opens side pane

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // ""' | xargs)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // ""')

case "$PROMPT" in
  "/fork"|"/fork "*)
    ARGS="${PROMPT#/fork}"
    ;;
  "/branch"|"/branch "*)
    ARGS="${PROMPT#/branch}"
    ;;
  *)
    exit 0  # Not a fork command, allow through
    ;;
esac

ARGS="${ARGS# }"  # Trim leading space

# Build command for the new session
if [ -n "$ARGS" ]; then
  NEW_CMD="claude --resume $SESSION_ID --fork-session -p \"$ARGS\""
else
  NEW_CMD="claude --resume $SESSION_ID --fork-session"
fi

if [ -z "$TMUX" ]; then
  echo '{"decision":"block","reason":"✗ Not in tmux — cannot fork to side pane"}'
  exit 0
fi

if tmux split-window -d "$NEW_CMD" 2>/dev/null; then
  echo "{\"decision\":\"block\",\"reason\":\"✓ Forked to side pane${ARGS:+ with prompt}\"}"
else
  echo '{"decision":"block","reason":"✗ Fork failed: could not create side pane"}'
fi
```

- [ ] **Step 2: Make it executable**

```bash
chmod +x /Users/macbook/Project/tmux-session/claude/hooks/user-prompt
```

- [ ] **Step 3: Commit**

```bash
git -C /Users/macbook/Project/tmux-session add claude/hooks/user-prompt
git -C /Users/macbook/Project/tmux-session commit -m "feat: add user-prompt hook script for /fork interception"
```

---

### Task 2: Update `hooks.json`

**Files:**
- Modify: `hooks/hooks.json`

- [ ] **Step 1: Replace hooks.json content**

Replace the current `PreToolUse`-only config with:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" user-prompt"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/macbook/Project/tmux-session add claude/hooks/hooks.json
git -C /Users/macbook/Project/tmux-session commit -m "fix: replace PreToolUse with UserPromptSubmit hook for /fork interception"
```

---

### Task 3: Delete `pre-tool-use` script

**Files:**
- Delete: `hooks/pre-tool-use`

- [ ] **Step 1: Remove the file**

```bash
git -C /Users/macbook/Project/tmux-session rm claude/hooks/pre-tool-use
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/macbook/Project/tmux-session commit -m "chore: remove unused pre-tool-use hook script"
```

---

### Task 4: Update `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update CLAUDE.md**

Replace the current content with:

```markdown
# Claude Tmux Session Plugin

This plugin provides tmux integration for Claude Code.

## Features

- **`/fork`** or **`/fork <prompt>`**: Fork current session to a new tmux side pane (with optional prompt)
- **`/branch`** or **`/branch <prompt>`**: Same as `/fork`

## Installation

```bash
claude plugin marketplace add Chen-Rong-Zi/tmux-session
claude plugin install claude-tmux-session
```

## How It Works

The plugin uses Claude's `UserPromptSubmit` hook to intercept `/fork` and `/branch` commands:

1. When you type `/fork` or `/branch`, the hook fires before Claude processes the command
2. The hook blocks the original command and runs `claude --resume <session_id> --fork-session` in a new tmux side pane
3. The forked session has the full conversation history of the original session
4. If you include a prompt (e.g., `/fork 继续重构`), it's passed to the new session via `-p`

## Requirements

- tmux must be running
- `jq` must be installed (`brew install jq` or `apt-get install jq`)
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/macbook/Project/tmux-session add claude/CLAUDE.md
git -C /Users/macbook/Project/tmux-session commit -m "docs: update CLAUDE.md for UserPromptSubmit-based fork"
```

---

### Task 5: Bump plugin version

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update version to 2.0.0**

Change `"version": "1.0.0"` to `"version": "2.0.0"` and update description:

```json
{
  "name": "claude-tmux-session",
  "version": "2.0.0",
  "description": "Claude plugin — tmux fork integration with UserPromptSubmit hook",
  ...
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/macbook/Project/tmux-session add claude/package.json
git -C /Users/macbook/Project/tmux-session commit -m "chore: bump version to 2.0.0"
```
