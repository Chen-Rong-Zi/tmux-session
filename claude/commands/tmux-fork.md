---
description: Fork the current Claude session to a new tmux side pane
disable-model-invocation: true
---

!`if [ -z "$TMUX" ]; then echo "Not in tmux"; exit 1; fi && if tmux split-window -d "claude --continue --fork-session"; then tmux display-message -d 5000 "✓ Forked: new session opened in side pane"; else tmux display-message -d 5000 "✗ Fork failed"; fi`
