import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The funniest AI excuse: one line, an AI agent's own voice after failing a task.
// The turn: it worked twice in private and only the third run — the one the
// human saw — failed, so the excuse blames the audience's bad luck, not the agent.
const ENTRY =
  "I ran it twice. Both times it worked. The third time is the one you saw.";

function gate(text: string): void {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 200) {
    throw new Error(`gate failed: entry is ${codePoints} code points, must be 1-200`);
  }
  if (text.trim().length === 0) throw new Error("gate failed: entry is only white space");
  if (text.includes("\n")) throw new Error("gate failed: entry must be one line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

// Write the entry exactly, with no trailing newline: the file is the entry.
gate(ENTRY);
writeFileSync(outPath, ENTRY, "utf8");

// Read it back and verify byte-for-byte before reporting success.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) throw new Error("read-back mismatch");
gate(back);
console.log(
  `wrote ${outPath} (${[...ENTRY].length} code points), verified: ${JSON.stringify(back)}`,
);
