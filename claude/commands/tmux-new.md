---
description: Open a new Claude session in a new tmux window
---

The user wants to open a new Claude session in a new tmux window.

!`if [ -z "$TMUX" ]; then echo "Not in tmux"; exit 1; fi && if tmux new-window claude; then tmux display-message -d 5000 "✓ New session opened in new window"; else tmux display-message -d 5000 "✗ Failed to open new session"; fi`

Tell the user a new session has been opened in a new tmux window and ask what they'd like to do next.
