# Claude Tmux Session Plugin

This plugin provides tmux integration for Claude Code.

## Features

- **`/tmux-fork`** or **`/tmux-fork <prompt>`**: Fork current session to a new tmux side pane (with optional prompt). The forked session has the full conversation history of the original session.
- **`/tmux-new`** or **`/tmux-new <prompt>`**: Open a new Claude session in a new tmux window (with optional initial prompt).

## Installation

```bash
claude plugin marketplace add Chen-Rong-Zi/tmux-session
claude plugin install claude-tmux-session
```

## How It Works

The plugin uses Claude's `UserPromptSubmit` hook to intercept `/tmux-fork` and `/tmux-new` commands:

1. When you type `/tmux-fork` or `/tmux-new`, the hook fires before Claude processes the command
2. The hook blocks the original command and runs the corresponding tmux action in a new pane or window
3. If you include a prompt (e.g., `/tmux-fork 继续重构`), it's passed to the new session via `-p`
4. For `/tmux-fork`, the new session resumes the current session with `--fork-session` so history is preserved

## Requirements

- tmux must be running
- `jq` must be installed (`brew install jq` or `apt-get install jq`)
