# Claude Tmux Session Plugin

This plugin provides tmux integration for Claude Code.

## Features

- **Auto-fork**: When a new session starts in tmux, automatically fork it to a side pane
- **Clear handler**: When `/clear` is executed, create a new tmux window instead of clearing

## Installation

```bash
claude plugin install claude-tmux-session
```

## How It Works

The plugin uses Claude's hook system:
- `SessionStart` hook detects tmux environment and forks sessions
- `PreToolUse` hook intercepts `/clear` to create new tmux windows
