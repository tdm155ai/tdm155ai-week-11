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

// The class site's copy: the list at /elements/mechanics and one page per card under /elements/mechanics/cards/.
// Generated, like index.md; the cards here stay the source.
const site = path.resolve(root, "..", "nextjs", "content", "elements", "mechanics");
const repo = "https://github.com/tdm155ai/tdm155ai-week-11/blob/main/game-mechanics";
const q = (s) => JSON.stringify(s);
const list = [
  "---",
  'title: "Mechanics"',
  `description: ${q(`All ${cards.length}, in ${families.length} families, one line each, with a game that shows it.`)}`,
  "order: 2",
  "paper: 11x17",
  "---",
  "",
  "A **mechanic** is a rule that makes something happen: a timer, a vote, a secret, a turn, a roll of the dice. Games are built from them, and so are a lot of things that aren't games.",
  "",
  "**Use the list:** think of a game you play a lot and find three of its mechanics here. Then ask Claude to unpack them: how each works in that game, and what the game would feel like without it. Each mechanic opens on its own page with a two-minute version you can play in the room.",
  "",
];
for (const fam of families) {
  list.push(`## ${fam}`, "", "| # | Mechanic | One line | Shows it |", "| --- | --- | --- | --- |");
  for (const c of cards.filter((c) => c.family === fam)) {
    list.push(`| ${pad(c.number)} | [${c.title}](cards/${c.file}) | ${c.one_line} | ${c.shows_it} |`);
  }
  list.push("");
}
list.push(
  "## The full deck",
  "",
  `The same ${cards.length} mechanics are a deck of cards in this repo's [\`game-mechanics/\`](${repo}/README.md) folder, one file per card, with an 11×17 poster file for printing them one to a page. Missing one? Write a card: a name, one line, a game that shows it, a two-minute version, and a way to build it.`,
  "",
  "*The games named here are well-known examples from general knowledge and haven't been checked against sources yet. If one looks wrong to you, it may be: check it.*",
  "",
);
fs.rmSync(path.join(site, "cards"), { recursive: true, force: true });
fs.mkdirSync(path.join(site, "cards"), { recursive: true });
fs.writeFileSync(path.join(site, "README.md"), list.join("\n"));
fs.writeFileSync(path.join(site, "cards", "README.md"), [
  "---",
  'title: "The cards"',
  `description: ${q(`All ${cards.length} mechanics, one page each, in deck order.`)}`,
  "order: 1",
  "paper: 11x17",
  "---",
  "",
  "One page per mechanic. **Build it** names tools from last week's app (`/launch`, `/voice`, `/track`, `/draw-a-box`, `/stage`); use them, or ask Claude to build the same thing from scratch.",
  "",
].join("\n"));
for (const c of cards) {
  fs.writeFileSync(path.join(site, "cards", c.file), [
    "---",
    `title: ${q(c.title)}`,
    `description: ${q(c.one_line)}`,
    `eyebrow: ${q(`${c.family} · ${pad(c.number)}`)}`,
    `order: ${c.number}`,
    "---",
    "",
    `**Shows it:** ${c.shows_it}`, "",
    `**Try it in two minutes:** ${c.try_it}`, "",
    `**Build it:** ${c.build_it}`, "",
    `[All ${cards.length} mechanics](../README.md)`, "",
  ].join("\n"));
}

// One long list: each mechanic and its one line, grouped by family. Only one H1, so it prints continuously.
const printList = [
  "# Game mechanics",
  "",
  `*${cards.length} mechanics in ${families.length} families. TDM 155AI, week 11.*`,
  "",
];
for (const fam of families) {
  printList.push(`## ${fam}`, "");
  for (const c of cards.filter((c) => c.family === fam)) {
    printList.push(`**${c.title}.** ${c.one_line}`, "");
  }
}
fs.writeFileSync(path.join(root, "print", "list.md"), printList.join("\n"));

console.log(`${cards.length} cards → index.md, print/posters-11x17.md, print/list.md, nextjs/content/elements/mechanics/`);
