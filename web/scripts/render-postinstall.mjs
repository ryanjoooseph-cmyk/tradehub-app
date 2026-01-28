import { execSync } from "node:child_process";

const isLinux = process.platform === "linux";

// Only run on Render/Linux. Avoid breaking local mac dev.
if (!isLinux) {
  console.log("[postinstall] non-linux platform, skipping lightningcss linux binary install");
  process.exit(0);
}

try {
  console.log("[postinstall] installing lightningcss-linux-x64-gnu (linux binary)...");
  execSync("npm i --no-save lightningcss-linux-x64-gnu", { stdio: "inherit" });
  console.log("[postinstall] lightningcss linux binary installed");
} catch (e) {
  console.error("[postinstall] failed to install lightningcss-linux-x64-gnu");
  process.exit(1);
}
