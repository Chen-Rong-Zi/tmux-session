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

## Commands

| Command | Action |
|---------|--------|
| `/fork` | Creates a new tmux side pane with a forked session |
| `/new` | Creates a new tmux window with a new session |
