// Builds index.md and print/posters-11x17.md from the cards in cards/. No dependencies.
// Run from the repo root: node game-mechanics/scripts/build.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsDir = path.join(root, "cards");

// The card frontmatter is one `key: value` per line; string values are JSON-quoted.
function readCard(file) {
  const text = fs.readFileSync(path.join(cardsDir, file), "utf8");
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`no frontmatter in ${file}`);
  const card = { file };
  for (const line of fm[1].split("\n")) {
    const i = line.indexOf(": ");
    if (i < 0) continue;
    const key = line.slice(0, i);
    const raw = line.slice(i + 2);
    card[key] = /^["[\d]/.test(raw) ? JSON.parse(raw) : raw;
  }
  return card;
}

const cards = fs.readdirSync(cardsDir).filter((f) => f.endsWith(".md")).sort().map(readCard);
const families = [...new Set(cards.map((c) => c.family))];
const pad = (n) => String(n).padStart(2, "0");

const index = [
  "# Game mechanics: the index",
  "",
  `${cards.length} mechanics in ${families.length} families. Built from \`cards/\` by \`scripts/build.mjs\`; edit the cards, not this file.`,
  "",
];
for (const fam of families) {
  index.push(`## ${fam}`, "", "| # | Mechanic | One line | Shows it |", "| --- | --- | --- | --- |");
  for (const c of cards.filter((c) => c.family === fam)) {
    index.push(`| ${pad(c.number)} | [${c.title}](cards/${c.file}) | ${c.one_line} | ${c.shows_it} |`);
  }
  index.push("");
}
fs.writeFileSync(path.join(root, "index.md"), index.join("\n"));

// For the mk-printing skill's vanilla 11x17: every H1 after the first starts a page,
// and the italic paragraph right after an H1 prints large.
const posters = [
  "# Game mechanics",
  "",
  `*${cards.length} mechanics in ${families.length} families, one per page. TDM 155AI, week 11.*`,
  "",
  "A mechanic is a rule that makes something happen: a timer, a vote, a secret, a turn, a roll of the dice. Games are built from mechanics.",
  "",
  ...families.map((fam) => `- **${fam}:** ${cards.filter((c) => c.family === fam).map((c) => c.title).join(" · ")}`),
  "",
];
for (const c of cards) {
  posters.push(
    `# ${c.title}`, "",
    `*${c.one_line}*`, "",
    `## Shows it`, "", c.shows_it, "",
    `## Try it in two minutes`, "", c.try_it, "",
    `## Build it`, "", c.build_it, "",
    `${c.family} · ${pad(c.number)}`, "",
  );
}
fs.mkdirSync(path.join(root, "print"), { recursive: true });
fs.writeFileSync(path.join(root, "print", "posters-11x17.md"), posters.join("\n"));

console.log(`${cards.length} cards → index.md, print/posters-11x17.md`);
