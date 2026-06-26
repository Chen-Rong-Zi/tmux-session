# Claude Tmux Fork Plugin — Design Spec

## Overview

Replace the broken `PreToolUse`-based hook with a `UserPromptSubmit` hook that intercepts `/fork` and `/branch` commands, blocks their default behavior, and instead opens a forked session in a tmux side pane using `claude --resume <session_id> --fork-session`.

## Background

The existing plugin registers a `PreToolUse` hook with matcher `"Bash"` that tries to grep for `/fork` in Bash command inputs. This never triggers because `/fork` is a built-in slash command, not a Bash tool call.

OpenCode's equivalent plugin works because it receives a `session.created` event with the new session ID and calls `opencode --session <id>` in a side pane. Claude Code's hook system has no equivalent event.

The official hooks reference documents that `UserPromptSubmit` fires for every user prompt and supports `decision: "block"`:

> "UserPromptSubmit — Runs when the user submits a prompt, before Claude processes it."
> "decision: 'block' prevents the prompt from being processed and erases it from context."
> Input includes: `session_id`, `prompt`, `transcript_path`, `cwd`.

CLI reference confirms true forking via `--fork-session`:

> "claude --continue --fork-session — When resuming, create a new session ID instead of reusing the original"

## Architecture

```
User input "/fork 继续重构"
        │
        ▼
UserPromptSubmit hook fires
stdin: {"prompt":"/fork 继续重构", "session_id":"abc123", ...}
        │
        ▼
user-prompt script
        │
        ├── prompt starts with "/fork" or "/branch" ?
        │   ├── NO  → exit 0 (pass through)
        │   └── YES → continue
        │
        ├── in tmux? ($TMUX set?)
        │   ├── NO  → return {"decision":"block","reason":"✗ Not in tmux"}
        │   └── YES → continue
        │
        ├── tmux split-window -d "claude --resume <session_id> --fork-session [-p <args>]"
        │   ├── SUCCESS → return {"decision":"block","reason":"✓ Forked to side pane"}
        │   └── FAIL    → return {"decision":"block","reason":"✗ Fork failed"}
        │
        ▼
Original /fork is blocked, user sees reason in Claude Code
```

## Files

| File | Action | Purpose |
|------|--------|---------|
| `hooks/hooks.json` | Replace | Change from `PreToolUse` to `UserPromptSubmit` |
| `hooks/pre-tool-use` | Delete | No longer needed |
| `hooks/user-prompt` | Create | Core hook script |
| `hooks/run-hook.cmd` | Keep | Cross-platform wrapper |
| `hooks/session-start` | Keep | Already exists, exit 0 |
| `CLAUDE.md` | Update | Document new behavior |

## hooks.json

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

Notes:
- `SessionStart` is kept for compatibility (other plugins may depend on it)
- `UserPromptSubmit` matcher is empty string `""` to fire on every prompt (we filter inside the script)
- No `PreToolUse` entry — removed entirely

## user-prompt Script

```bash
#!/bin/bash
# UserPromptSubmit hook — intercept /fork and /branch, fork to tmux side pane

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

## Behavior Matrix

| User Input | In tmux? | Result |
|------------|----------|--------|
| `/fork` | Yes | Blocked. New tmux pane opens with `claude --resume <id> --fork-session` (full history copied) |
| `/fork 继续重构` | Yes | Blocked. New tmux pane opens with `claude --resume <id> --fork-session -p "继续重构"` |
| `/branch` | Yes | Same as `/fork` |
| `/branch try-auth` | Yes | Blocked. New tmux pane with `-p "try-auth"` |
| `/fork` | No | Blocked. Message: "Not in tmux" |
| `写一个函数` | Any | Pass through (exit 0) |
| `/clear` | Any | Pass through (no match) |

## Timeout

`UserPromptSubmit` hooks have a **30-second default timeout** (shorter than the 600-second default for most other hook events). The fork operation (parsing JSON + running tmux) completes in under a second, so this is not a concern. If the script somehow blocks longer, Claude Code will abort the hook and let the original `/fork` pass through (no block = allow).

## Edge Cases

- **`session_id` empty**: Should not occur — `UserPromptSubmit` always includes `session_id`. If it somehow does, `claude --resume ""` will fail gracefully.
- **tmux pane creation fails**: User sees the failure reason in Claude Code's UI.
- **Multiple `/fork` in quick succession**: Each creates its own side pane; no conflict.
- **Session already named**: `--resume` matches by ID, so name is irrelevant.
- **`--fork-session` vs plain `--continue`**: `--fork-session` creates a new session ID, keeping the original intact. This is the correct fork behavior.

## Testing

1. Install plugin from local path: `claude plugin install /Users/macbook/Project/tmux-session/claude`
2. Verify with `/hooks` that `UserPromptSubmit` hook appears
3. Inside tmux, type `/fork` — confirm side pane opens with session history
4. Type `/fork 帮我重构` — confirm side pane opens and starts working on the task
5. Type a normal prompt — confirm it passes through unaffected
6. Run outside tmux — confirm block message appears
