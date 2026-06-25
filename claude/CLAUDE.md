# Claude Tmux Session Plugin

This plugin provides tmux integration for Claude Code.

## Features

- **New window**: Use `/new` to open a new Claude session in a new tmux window

## Installation

```bash
claude plugin marketplace add Chen-Rong-Zi/tmux-session
claude plugin install claude-tmux-session
```

## How It Works

The plugin uses Claude's hook system:
- `SessionStart` hook logs plugin activation
- Skills provide `/new` command for opening new windows

## Note

This plugin does NOT auto-fork sessions (unlike the opencode version). Use `/new` to create new sessions in new tmux windows.
