---
description: Fork the current Claude session to a new tmux side pane
---

The user wants to fork the current Claude session to a new tmux side pane.

Run: `!tmux split-window -d "claude --resume $(cat /tmp/claude-current-session 2>/dev/null) --fork-session"`

Tell the user the session has been forked to a new tmux side pane.
