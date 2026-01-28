import { execSync } from "node:child_process";

const pkgs = ["lightningcss-linux-x64-gnu", "@next/swc-linux-x64-gnu"];

for (const pkg of pkgs) {
  console.log(`[postinstall] installing ${pkg}...`);
  execSync(`npm i --no-save ${pkg}`, { stdio: "inherit" });
}

console.log("[postinstall] done");
