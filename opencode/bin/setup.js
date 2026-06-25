#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = join(__dirname, "..");

const OCODE = join(process.env.HOME || process.env.USERPROFILE, ".config", "opencode");
const COMMANDS_DIR = join(OCODE, "commands");
const CONFIG_PATH = join(OCODE, "opencode.json");

let ok = true;

const cmdSrc = join(PKG, "commands", "new-session.md");
const cmdDst = join(COMMANDS_DIR, "new-session.md");
if (existsSync(cmdSrc)) {
  if (!existsSync(COMMANDS_DIR)) mkdirSync(COMMANDS_DIR, { recursive: true });
  copyFileSync(cmdSrc, cmdDst);
  console.log(`✓ Installed command: ${cmdDst}`);
} else {
  console.error(`✗ Command file not found: ${cmdSrc}`);
  ok = false;
}

if (existsSync(CONFIG_PATH)) {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    const config = JSON.parse(raw);
    if (!Array.isArray(config.plugin)) config.plugin = [];
    if (!config.plugin.includes("opencode-tmux-session")) {
      config.plugin.push("opencode-tmux-session");
      writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
      console.log("✓ Added opencode-tmux-session to plugin array");
    } else {
      console.log("ℹ opencode-tmux-session already in plugin array");
    }
  } catch (e) {
    console.error(`✗ Failed to update opencode.json: ${e.message}`);
    ok = false;
  }
} else {
  console.error("✗ opencode.json not found, plugin entry not added");
  ok = false;
}

if (ok) {
  console.log("\nDone! Restart opencode for changes to take effect.");
} else {
  process.exit(1);
}
