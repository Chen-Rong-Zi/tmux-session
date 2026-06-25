# tmux-session

Tmux session management plugin for OpenCode and Claude.

## Overview

This plugin provides tmux integration for AI coding assistants:
- **Auto-fork**: Automatically fork sessions to tmux side panes
- **Window management**: Create new tmux windows for `/clear` commands

## Installation

### OpenCode

```bash
cd opencode
npm install
```

Or install from npm:
```bash
npm install opencode-tmux-session
```

### Claude

```bash
claude plugin install claude-tmux-session
```

Or install from the repository:
```bash
claude plugin install github:your-username/tmux-session/claude
```

## Features

- Detects tmux environment automatically
- Forks new sessions to side panes
- Handles `/clear` by creating new tmux windows
- Status notifications via tmux display-message

## License

MIT
