---
description: Open a new opencode session in a new tmux window
---

The user wants to start a new opencode session.

!`if tmux new-window opencode; then tmux display-message -d 5000 "✓ New session opened in new window"; else tmux display-message -d 5000 "✗ Failed to open new session"; fi`

Tell the user a new session has been opened in a new tmux window and ask what they'd like to do next.
