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
