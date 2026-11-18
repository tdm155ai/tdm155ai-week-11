// Builds the word files the games read, from a GloVe vector file (Stanford NLP, glove.6B.100d.txt, public domain under
// the ODC PDDL: https://nlp.stanford.edu/projects/glove/). Run it once from nextjs/:
//
//   node lib/games/build-word-files.mjs /path/to/glove.6B.100d.txt
//
// It writes, beside this file:
//   wordle-dictionary.js   the five-letter words Wordle accepts as guesses (the most common ones in GloVe)
//   semantle-words.json    Semantle's vocabulary, most common first
//   semantle-vectors.bin   one vector per vocabulary word, 100 signed bytes each, in the same order
//
// GloVe lists words from most to least common, so "the first N" is "the N most common".
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { TARGETS } from "./semantle.js";

const SEMANTLE_WORDS = 15000; // how many words Semantle knows; more lets players guess rarer words but makes the file bigger
const WORDLE_SCAN = 60000; // how far down the list to look for five-letter words

const source = process.argv[2];
if (!source) {
  console.error("Usage: node lib/games/build-word-files.mjs /path/to/glove.6B.100d.txt");
  process.exit(1);
}
const here = path.dirname(new URL(import.meta.url).pathname);

const fiveLetter = [];
const words = [];
const vectors = [];
const wanted = new Set(TARGETS);
let seen = 0;

for await (const line of readline.createInterface({ input: createReadStream(source) })) {
  const space = line.indexOf(" ");
  const word = line.slice(0, space);
  seen += 1;
  if (seen <= WORDLE_SCAN && /^[a-z]{5}$/.test(word)) fiveLetter.push(word);
  const take = words.length < SEMANTLE_WORDS ? /^[a-z]{2,}$/.test(word) : wanted.has(word);
  if (take) {
    words.push(word);
    vectors.push(line.slice(space + 1).split(" ").map(Number));
    wanted.delete(word);
  }
  if (seen >= WORDLE_SCAN && words.length >= SEMANTLE_WORDS && !wanted.size) break;
}
if (wanted.size) console.warn(`Not in GloVe, so never hidden: ${[...wanted].join(", ")}`);

// Each vector is scaled so its largest value is 127 and rounded to a whole number, which fits in one byte. Cosine
// similarity ignores length, so the scale changes nothing; the rounding moves scores by well under a point.
const dims = vectors[0].length;
const bytes = new Int8Array(words.length * dims);
vectors.forEach((vector, row) => {
  const max = Math.max(...vector.map(Math.abs));
  vector.forEach((value, col) => { bytes[row * dims + col] = Math.round((value / max) * 127); });
});

const lines = [];
for (let i = 0; i < fiveLetter.length; i += 16) lines.push(`  ${fiveLetter.slice(i, i + 16).join(" ")}`);
await writeFile(path.join(here, "wordle-dictionary.js"), `// Built by build-word-files.mjs from GloVe: the five-letter words Wordle accepts as guesses. Add words to the list; to
// rebuild it, see that script.
export const DICTIONARY = new Set(\`
${lines.join("\n")}
\`.split(/\\s+/).filter(Boolean));
`);
await writeFile(path.join(here, "semantle-words.json"), JSON.stringify({ source: "GloVe 6B, 100 dimensions (Stanford NLP, ODC PDDL)", dims, words }));
await writeFile(path.join(here, "semantle-vectors.bin"), bytes);
console.log(`wordle-dictionary.js: ${fiveLetter.length} words; semantle: ${words.length} words × ${dims} dimensions (${bytes.length} bytes)`);
