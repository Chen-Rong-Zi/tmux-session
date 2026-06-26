import { type Plugin } from "@opencode-ai/plugin";
import { appendFileSync } from "fs";

const LOG = "/tmp/opencode-tmux-session.log";
const log = (m: string) => { try { appendFileSync(LOG, `[${Date.now()}] ${m}\n`); } catch {} };

export const TmuxSessionPlugin: Plugin = async ({ $, client }) => {
  log("init");

  if (!process.env.TMUX_PANE) { log("no tmux"); return {}; }

  return {
    "command.execute.before": async ({ command, sessionID, arguments: args }, output) => {
      if (command !== "tmux-fork") return;

      try {
        log(`fork: session=${sessionID} args=${args}`);

        // Use SDK to fork the session — this does NOT trigger session.created
        const fork = await client.session.fork({ path: { id: sessionID } });
        if (!fork.data) {
          log(`fork error: ${fork.error}`);
          output.parts = [{ type: "text", text: "Fork failed: SDK error." }] as any;
          return;
        }
        const newId = fork.data.id;
        log(`forked: newId=${newId}`);

        // Open the forked session in a new tmux side pane
        const r = await $`tmux split-window -d opencode --session ${newId}`.nothrow();
        if (r.exitCode === 0) {
          await $`tmux display-message -d 5000 "✓ Forked: new session opened in side pane (${newId.slice(0, 8)})"`.nothrow();
        } else {
          await $`tmux display-message -d 5000 "✗ Fork failed: could not create side pane"`.nothrow();
        }

        // Replace command output — prevents original session from switching.
        // Use type assertion since the runtime fills in id/sessionID/messageID.
        output.parts = [{
          type: "text",
          text: r.exitCode === 0
            ? `Session forked to side pane.`
            : `Fork failed: could not create side pane.`,
        }] as any;

        log(`exit=${r.exitCode}`);
      } catch (e) {
        await $`tmux display-message -d 5000 "✗ Fork error: ${String(e).slice(0, 60)}"`.nothrow();
        log(`err=${e}`);
      }
    },
  };
};

export default TmuxSessionPlugin;
export const server = TmuxSessionPlugin;
