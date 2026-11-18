# TDM 155AI, week 11: Games

For class on Wednesday, November 18, 2026. Games answer back. This week we look at what a game is made of, play and remake a few small ones, and build one mechanic of our own: for a game, or for a presentation, a lab report, or a research tool that could use one.

## Run it

Use Node 22 or newer and pnpm. From this repository's root:

```
cd nextjs
pnpm install
pnpm dev -p 3000
```

Open http://localhost:3000 in Chrome.

## What's here

The site has four parts, and each is a folder of Markdown in `nextjs/content/`. Edit a file and refresh the page to see the change.

| Part | Page | Folder |
| --- | --- | --- |
| Why? | `/why` | `nextjs/content/why/` |
| Elements | `/elements` | `nextjs/content/elements/` |
| Building games | `/games` | `nextjs/content/games/`, with the games themselves in `nextjs/app/games/` |
| Final project | `/final-project-and-portfolio` | `nextjs/content/final-project-and-portfolio/` |

Put `/print` in front of any page's address for a version to print.

## NFC cards

A card or sticker that opens a link when a phone taps it is a small game piece you can make this week.

- [`nfc-tools/`](nfc-tools/README.md) writes a link onto an NFC tag with a USB reader, and can lock the tag so nobody else rewrites it.
- [`nfc-app/`](nfc-app/README.md) is a separate small app where taps land, with one sub-app per colour. It runs on a laptop and reaches phones through a tunnel.
- [`nfc-app/MECHANICS.md`](nfc-app/MECHANICS.md) describes what a card can do: one card or many, a link that stays the same or one that changes, and what the tap sets off.

## The full deck

[`game-mechanics/`](game-mechanics/README.md) holds the full deck of 50 game mechanics, one card per file, with an index and a poster file for printing.
