# Claude Tmux Session Plugin

This plugin provides tmux integration for Claude Code.

## Features

- **Auto-fork**: When running in tmux, automatically fork new sessions to a side pane
- **New window**: Use `/new` to open a new Claude session in a new tmux window

## Installation

```bash
claude plugin marketplace add Chen-Rong-Zi/tmux-session
claude plugin install claude-tmux-session
```

## How It Works

The plugin uses Claude's hook system:
- `SessionStart` hook detects tmux environment and auto-forks sessions
- Skills provide `/new` command for opening new windows

## Recursion Prevention

The plugin sets `FORKED_BY_PLUGIN=1` environment variable in forked panes to prevent infinite recursion.
