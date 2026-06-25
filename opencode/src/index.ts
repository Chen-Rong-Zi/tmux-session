import { type Plugin } from "@opencode-ai/plugin";
import { appendFileSync } from "fs";

const LOG = "/tmp/opencode-tmux-session.log";
const log = (m: string) => { try { appendFileSync(LOG, `[${Date.now()}] ${m}\n`); } catch {} };

export const TmuxSessionPlugin: Plugin = async ({ $ }) => {
  log("init");

  if (!process.env.TMUX_PANE) { log("no tmux"); return {}; }

  return {
    event: async ({ event }) => {
      if (event.type === "session.created") {
        const id = event.properties.info?.id;
        const pid = event.properties.info?.parentID;
        if (!id || pid) return;
        const cmd = `opencode --session ${id}`;
        log(`fork: ${cmd}`);
        try {
          const r = await $`tmux split-window -d ${cmd}`.nothrow();
          if (r.exitCode === 0) {
            await $`tmux display-message -d 5000 "✓ Forked: new session opened in side pane (${id.slice(0, 8)})"`.nothrow();
          } else {
            await $`tmux display-message -d 5000 "✗ Fork failed: could not create side pane"`.nothrow();
          }
          log(`exit=${r.exitCode}`);
        } catch (e) {
          await $`tmux display-message -d 5000 "✗ Fork error: ${String(e).slice(0, 60)}"`.nothrow();
          log(`err=${e}`);
        }
      }
    },
  };
};

export default TmuxSessionPlugin;
export const server = TmuxSessionPlugin;
