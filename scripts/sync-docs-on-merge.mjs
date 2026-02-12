import fs from "node:fs";

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
}

function write(path, content) {
  fs.writeFileSync(path, content, "utf8");
}

function nowIso() {
  return new Date().toISOString();
}

function tickChecklist(md, prNumber) {
  const prTag = `PR${prNumber}`;
  const lines = md.split("\n");

  const out = lines.map((line) => {
    const isCheckbox = /^\s*-\s*\[( |x)\]\s+/.test(line);

    if (!isCheckbox) return line;

    const lower = line.toLowerCase();
    const mentionsPr =
      line.includes(prTag) ||
      lower.includes(`pr ${prNumber}`) ||
      lower.includes(`pr#${prNumber}`) ||
      lower.includes(`#${prNumber}`);

    if (!mentionsPr) return line;

    return line.replace(/-\s*\[( |x)\]/, "- [x]");
  });

  const mergePhraseRegex = new RegExp(`^\\s*-\\s*\$begin:math:display$\( \|x\)\\$end:math:display$\\s+Merge\\s+PR${prNumber}\\s+to\\s+main\\b`, "i");
  let foundMergeLine = false;

  const out2 = out.map((line) => {
    if (mergePhraseRegex.test(line)) {
      foundMergeLine = true;
      return line.replace(/-\s*\[( |x)\]/, "- [x]");
    }
    return line;
  });

  if (!foundMergeLine) return out2.join("\n");

  return out2.join("\n");
}

function updateStatusMd(md, prNumber, prTitle) {
  const stamp = nowIso();
  const header = "# Status\n";
  const body = [
    "",
    `Last merge: PR${prNumber} — ${prTitle}`,
    `Updated: ${stamp}`,
    ""
  ].join("\n");

  if (!md.trim()) return header + body;

  const lines = md.split("\n");
  const hasHeader = lines[0].trim() === "# Status";

  const next = hasHeader ? lines : [header.trim(), ...lines];
  const filtered = next.filter((l) => !l.startsWith("Last merge:") && !l.startsWith("Updated:"));

  const insertAt = filtered.findIndex((l) => l.trim() === "# Status");
  if (insertAt === -1) return header + body + filtered.join("\n");

  const result = [
    ...filtered.slice(0, insertAt + 1),
    `Last merge: PR${prNumber} — ${prTitle}`,
    `Updated: ${stamp}`,
    ...filtered.slice(insertAt + 1).filter((l) => l.trim() !== "")
  ];

  return result.join("\n").trimEnd() + "\n";
}

function main() {
  const prNumber = process.env.PR_NUMBER;
  const prTitle = process.env.PR_TITLE || "Merged PR";

  if (!prNumber) {
    console.error("Missing PR_NUMBER");
    process.exit(1);
  }

  const checklistPath = "docs/pr-implementation-checklists.md";
  const statusPath = "docs/STATUS.md";

  const checklist = read(checklistPath);
  const status = read(statusPath);

  if (checklist) {
    const updatedChecklist = tickChecklist(checklist, prNumber);
    if (updatedChecklist !== checklist) write(checklistPath, updatedChecklist);
  }

  const updatedStatus = updateStatusMd(status, prNumber, prTitle);
  write(statusPath, updatedStatus);
}

main();
