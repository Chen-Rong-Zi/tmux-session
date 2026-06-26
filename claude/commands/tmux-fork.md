---
description: Fork the current Claude session to a new tmux side pane
---

The user wants to fork the current Claude session to a new tmux side pane. The forked session will have the full conversation history.

!`if [ -z "$TMUX" ]; then echo "Not in tmux"; exit 1; fi && if tmux split-window -d "claude --continue --fork-session"; then tmux display-message -d 5000 "✓ Forked: new session opened in side pane"; else tmux display-message -d 5000 "✗ Fork failed"; fi`

Tell the user the session has been forked to a new tmux side pane and ask what they'd like to do next.
