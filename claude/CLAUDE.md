# Claude Tmux Session Plugin

This plugin provides tmux integration for Claude Code.

## Features

- **`/fork`**: Fork current session to a new tmux side pane
- **`/new`**: Open a new Claude session in a new tmux window

## Installation

```bash
claude plugin marketplace add Chen-Rong-Zi/tmux-session
claude plugin install claude-tmux-session
```

## How It Works

The plugin uses Claude's PreToolUse hook to intercept commands:
- When you type `/fork`, it creates a new tmux side pane with a Claude session
- When you type `/new`, it creates a new tmux window with a Claude session
