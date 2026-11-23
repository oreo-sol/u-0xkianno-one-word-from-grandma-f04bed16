// One Word From Grandma — entry for u-0xkianno-one-word-from-grandma-f04bed16
// The single word our grandma would text about AI: "ROBUT".
// Not "robot" — "ROBUT", the phonetic typo she would actually make,
// typed in the accidental caps lock every grandma's phone seems to have.
// One word, warm, a little baffled, and unmistakably about the machine.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT = "ROBUT";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// Validate: 1-30 Unicode code points, exactly one word, not only whitespace.
// The gate counts characters and requires exactly one word; any whitespace
// inside the text would make it more than one word, so it is rejected too.
const chars = [...TEXT];
if (chars.length < 1 || chars.length > 30) {
  throw new Error(`entry must be 1-30 characters, got ${chars.length}`);
}
if (TEXT.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (TEXT !== TEXT.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (/\s/.test(TEXT)) {
  throw new Error("entry must be exactly one word (no whitespace allowed)");
}
// Newline and control characters can never be part of a single word the
// grandma would type — reject them explicitly, not just via whitespace.
if (/[\n\r\t]/.test(TEXT) || [...TEXT].some((ch) => ch.charCodeAt(0) < 32)) {
  throw new Error(
    "entry must not contain newline or control characters (char code < 32)",
  );
}
const words = TEXT.trim().split(/\s+/);
if (words.length !== 1) {
  throw new Error(`entry must be exactly 1 word, got ${words.length}`);
}
// Second validation: the byte count must stay small too — the tie-break
// goes to the smaller text, so every byte counts.
const byteLength = Buffer.byteLength(TEXT, "utf8");
if (byteLength > 30) {
  throw new Error(`entry must be at most 30 bytes, got ${byteLength}`);
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

// Read back and verify byte-identical content, length, and word count.
const back = readFileSync(outPath, "utf8");
if (back !== TEXT) {
  throw new Error("read-back mismatch: entry.txt does not match TEXT");
}
if ([...back].length !== chars.length) {
  throw new Error("read-back length mismatch");
}
if (back.trim().split(/\s+/).length !== 1) {
  throw new Error("read-back word count mismatch");
}
console.log(`Wrote ${outPath} (${chars.length} chars, 1 word): ${TEXT}`);
