@AGENTS.md

# nfc-app

One Next.js app that NFC cards open on people's phones. It runs on a laptop (`pnpm dev`, port 3112) and phones reach it through a Cloudflare tunnel (`pnpm tunnel`).

## Where things go

- There are six sub-apps, one per colour: `app/<colour>/` is served at `/<colour>`. If you are working on one colour, stay inside its folder: its pages, its components, and its `APP.md` (the description of that app: keep it current).
- Pages live under `/<colour>/…` (for example `app/red/start/page.tsx` is `/red/start`). Put components and helpers for an app inside `app/<colour>/` too; files there that aren't `page.tsx`, `layout.tsx` and similar aren't routes.
- The shared files (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next.config.ts`, `package.json`) affect every colour. Ask before changing them.
- Pages are read on phones, so design for a narrow screen first.

## The dev server and the tunnel

- Run **one** dev server only. Check with `lsof -iTCP:3112 -sTCP:LISTEN` before starting another.
- A quick tunnel gets a new random `https://….trycloudflare.com` URL every time it starts, and cards written with an old one stop working. Keep the current one in `.tunnel-url` (one line, no trailing slash) and read it from there; never guess.
- `next.config.ts` already allows `*.trycloudflare.com` in dev.

## What a card can do

Read `MECHANICS.md` before designing a card mechanic: the scale of the relationship (one-to-one, one-to-many, many-to-one, the web), its type and direction (static vs dynamic, the tap as a trigger), and what a card can carry (in practice one URL into this app). Describe your app's cards in those terms in your `APP.md`.

## Writing NFC cards

The writer is `../nfc-tools/write_url.py` (read `../nfc-tools/README.md`). It needs the USB reader (ACR122U), so cards are written on the computer the reader is plugged into.

```bash
cd ../nfc-tools && ./write_url.py "$(cat ../nfc-app/.tunnel-url)/red/start"
```

- Quote the URL (zsh treats `?` as a wildcard).
- Run with no URL to read a card back.
- NTAG213 holds about 140 bytes of URL, so keep paths short.
- Cards point at a tunnel URL, so they break when the tunnel restarts. Rewrite them after a restart, or use a stable redirect (see `README.md`).
