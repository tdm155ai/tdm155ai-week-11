# Game mechanics

A **mechanic** is a rule that makes something happen: a timer, a vote, a secret, a turn, a roll of the dice. Games are built from mechanics, and so is a lot of theater, music, installation work, and things that aren't games at all. This is a deck of 50, in eight families.

**Start with [the index](index.md)**: every mechanic on one page, by family. On the class site the same list is at `/elements/mechanics`, with a page for each card.

## Each card

One mechanic per file in [`cards/`](cards/), numbered `01`–`50`. Each card has:

- **One line:** what the mechanic does.
- **Shows it:** a well-known game where you can see it.
- **Try it in two minutes:** a paper, card, or body version you can play in the room, no computer.
- **Build it:** one way to build it with Claude Code. These name tools from week 10's app: `/launch` (keys, buttons, MIDI pads, a cue list with Go), `/voice` (spoken-word triggers), `/track` (MediaPipe hands, face, pose, floor zones), `/draw-a-box` (the overhead camera reads paper and cards), and `/stage` (the projector window). You can also ask Claude to build the same thing from scratch.

The same fields sit in each card's frontmatter, so a print layout, a display, or an app can read them.

The games on the cards are well-known examples from general knowledge and haven't been checked against sources yet. If one looks wrong, check it.

## Ways to play the deck

- **Draw three.** Shuffle, draw three cards, and design a game that uses all three in ten minutes. Play it once, then swap one card.
- **Name the mechanics.** Pick a game everyone knows and list every mechanic in it. Which one would you take away first?
- **Write a card.** Add a mechanic the deck is missing: a name, one line, a game that shows it, a two-minute version, and a build.

## Print it

With the class site running, open `/print/elements/mechanics` and print from the browser: the list, then one card per 11×17 sheet. [`print/posters-11x17.md`](print/posters-11x17.md) holds the same posters as one Markdown file, a title page and then one mechanic per page, for any Markdown-to-PDF tool that starts a new page at each top-level heading.

## Change it

Edit or add files in `cards/`, then rebuild (no dependencies), from this repo's root:

```sh
node game-mechanics/scripts/build.mjs
```

That rewrites `index.md`, `print/posters-11x17.md`, and the site's pages in `nextjs/content/elements/mechanics/`. They are generated, so edit the cards, not them.

## Where it comes from

The Learning Lab wrote these for this course in November 2026. Twenty-seven cards come from mechanics the LL had named for other workshops that fall (a small-theater challenge deck, an inventory of mechanics that bring an audience together, a video-games workshop's dialogue trees, and an installation week); twenty-three are new. Each card's `sources` field says which.
