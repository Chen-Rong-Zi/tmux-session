---
name: new
description: Open a new Claude session in a new tmux window
---

Use when the user types `/new` or asks to open a new session.

The user wants to start a completely new Claude session in a new tmux window.

Execute this command:

```bash
if tmux new-window "claude" 2>/dev/null; then
  tmux display-message -d 3000 "✓ New session opened in new window"
else
  tmux display-message -d 3000 "✗ Failed to open new session"
fi
```

Tell the user a new session has been opened in a new tmux window.
