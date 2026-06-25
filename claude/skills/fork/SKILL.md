---
name: fork
description: Fork current session to a new tmux side pane
---

Use when the user types `/fork` or asks to fork the current session.

The user wants to fork the current Claude session to a new tmux side pane.

Execute this command to create a forked session in a side pane:

```bash
if [ -z "$TMUX_PANE" ]; then
  echo "Not in tmux — cannot fork"
else
  tmux split-window -d "claude" && echo "✓ Forked: new session opened in side pane" || echo "✗ Fork failed"
fi
```

Tell the user the result of the fork operation.
