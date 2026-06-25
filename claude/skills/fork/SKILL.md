---
name: fork
description: Fork current session to a tmux side pane
---

Use when the user types `/fork` or asks to fork the current session to a tmux pane.

The user wants to fork the current Claude session to a new tmux side pane.

Execute this command to fork the session:

```bash
if [ -z "$TMUX_PANE" ]; then
  echo "Not in tmux — cannot fork"
else
  FORKED_BY_PLUGIN=1 tmux split-window -d "claude" && echo "✓ Forked: new session opened in side pane" || echo "✗ Fork failed"
fi
```

Tell the user the result of the fork operation.
