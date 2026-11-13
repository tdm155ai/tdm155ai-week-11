---
title: "Game mechanics"
author: claude (GM, Claude Code 01e4ddf0-9bb0-4c13-81fa-fc56e504176f), Nov 13, 2026
status: "First draft for Marlon to edit. The cards are drawn from the Learning Lab's earlier mechanics decks plus new entries; the game examples are from general knowledge and not yet source-checked."
---

# Game mechanics

A **mechanic** is a rule that makes something happen: a timer, a vote, a secret, a turn, a roll of the dice. Games are built from mechanics, and so is a lot of theater, music, and installation work. This is a deck of 50, in eight families, for TDM 155AI week 11 (games and interaction, class Wednesday, November 18, 2026).

**Start with [the index](index.md)**: every mechanic on one page, by family.

## Each card

One mechanic per file in [`cards/`](cards/), numbered `01`–`50`. Each card has:

- **One line:** what the mechanic does.
- **Shows it:** a well-known game where you can see it.
- **Try it in two minutes:** a paper, card, or body version anyone can play in the room, no computer.
- **Build it:** one way to build it with Claude Code, using the week 10 app's tools: `/launch` (keys, buttons, MIDI pads, a cue list with Go), `/voice` (spoken-word triggers), `/track` (MediaPipe hands, face, pose, floor zones), `/draw-a-box` (the overhead camera reads paper and cards), and `/stage` (the projector window).

The same fields sit in each card's frontmatter, so a print layout, a display, or an app can read them.

## Ways to play the deck

- **Draw three.** Shuffle, draw three cards, and design a game that uses all three in ten minutes. Play it once, then swap one card.
- **Name the mechanics.** Pick a game everyone knows and list every mechanic in it. Which one would you take away first?
- **Write a card.** Add a mechanic the deck is missing: a name, one line, a game that shows it, a two-minute version, and a build.

## Print it

Wall posters, one mechanic per 11×17 page (51 pages with the title page), with The Notebook's `mk-printing` skill. From The Notebook root:

```sh
node .agents/skills/mk-printing/scripts/print.mjs apps/tdm155ai/tdm155ai-week-11/game-mechanics/print/posters-11x17.md --open
```

Hand cards at half-letter (two per Letter sheet with a cut line) are proposed, not built yet.

## Change it

Edit or add files in `cards/`, then rebuild the index and the poster file (no dependencies):

```sh
node game-mechanics/scripts/build.mjs
```

Run it from this repo's root. `index.md` and `print/posters-11x17.md` are generated; don't edit them by hand.

## Where it comes from

Twenty-seven cards come from mechanics the Learning Lab named for other workshops this fall: a small-theater challenge deck and an inventory of mechanics that bring an audience together (both November 5), a video-games workshop's dialogue-tree station (October 22), the week 10 installation mechanics (November 11), and this course's plan for AI co-stars. Twenty-three are new. Each card's `sources` field says which. Planning notes stay outside this repo.
