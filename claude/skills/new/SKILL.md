---
name: new
description: Open a new Claude session in a new tmux window
---

Use when the user types `/new` or asks to open a new session in a new window.

The user wants to start a new Claude session in a new tmux window.

Execute this command to open a new window:

```bash
if tmux new-window "claude" 2>/dev/null; then
  echo "✓ New session opened in new window"
else
  echo "✗ Failed to open new session"
fi
```

Tell the user the result of the operation.
